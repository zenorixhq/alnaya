"use client";

import { useState, useEffect, useCallback } from "react";
import { SiteImagesConfig, defaultSiteImages } from "@/types/siteImages";

const STORAGE_KEY = "alnaya_site_images_v2";
const STORAGE_TIME_KEY = "alnaya_site_images_time";
const EVENT_NAME = "alnaya:site-images-updated";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours client cache to protect database

// Module-level deduplication promise so 10 mounted components only make 1 network request
let inFlightPromise: Promise<SiteImagesConfig | null> | null = null;

function getCachedSiteImages(): SiteImagesConfig {
  if (typeof window === "undefined") return defaultSiteImages;
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === "object") {
        return { ...defaultSiteImages, ...parsed };
      }
    }
  } catch (e) {}
  return defaultSiteImages;
}

function isCacheValid(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const timestamp = localStorage.getItem(STORAGE_TIME_KEY);
    if (timestamp && Date.now() - parseInt(timestamp, 10) < CACHE_TTL_MS) {
      return true;
    }
  } catch (e) {}
  return false;
}

export function useSiteImages() {
  const [images, setImages] = useState<SiteImagesConfig>(() => getCachedSiteImages());
  const [hasLoaded, setHasLoaded] = useState(false);

  // Sync with API with strict deduplication
  const refresh = useCallback(async (force = false) => {
    // If cache is fresh and not forced (e.g. storefront visit), do not hit the database!
    if (!force && isCacheValid()) {
      setHasLoaded(true);
      return;
    }

    if (!inFlightPromise) {
      inFlightPromise = (async () => {
        try {
          const res = await fetch("/api/site-images");
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data === "object") {
              const merged = { ...defaultSiteImages, ...data };
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                localStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());
              } catch (e) {}
              return merged;
            }
          }
        } catch (err) {
          console.warn("Failed to fetch site images:", err);
        } finally {
          setTimeout(() => {
            inFlightPromise = null;
          }, 1000);
        }
        return null;
      })();
    }

    try {
      const result = await inFlightPromise;
      if (result) {
        setImages(result);
      }
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    refresh();

    // Listen to local update events across components
    const handleUpdate = (e: CustomEvent<SiteImagesConfig>) => {
      if (e.detail) {
        setImages((prev) => ({ ...prev, ...e.detail }));
      }
    };

    window.addEventListener(EVENT_NAME as any, handleUpdate as any);
    return () => {
      window.removeEventListener(EVENT_NAME as any, handleUpdate as any);
    };
  }, [refresh]);

  // Helper to update one or multiple images
  const updateImages = async (newImages: Partial<SiteImagesConfig>) => {
    const updated = { ...images, ...newImages };
    setImages(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    } catch (e) {}

    try {
      const res = await fetch("/api/site-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newImages),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.images) {
          setImages(result.images);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(result.images));
          localStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());
        }
        return true;
      }
    } catch (err) {
      console.error("Failed to save site images to API:", err);
    }
    return false;
  };

  return {
    images,
    hasLoaded,
    updateImages,
    refresh,
  };
}
