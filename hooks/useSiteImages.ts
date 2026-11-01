"use client";

import { useState, useEffect, useCallback } from "react";
import { SiteImagesConfig, defaultSiteImages } from "@/types/siteImages";

const STORAGE_KEY = "alnaya_site_images";
const EVENT_NAME = "alnaya:site-images-updated";

export function useSiteImages() {
  const [images, setImages] = useState<SiteImagesConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object") {
            return { ...defaultSiteImages, ...parsed };
          }
        }
      } catch (e) {}
    }
    return defaultSiteImages;
  });

  const [hasLoaded, setHasLoaded] = useState(false);

  // Sync with API
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/site-images");
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          const merged = { ...defaultSiteImages, ...data };
          setImages(merged);
          try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn("Failed to fetch site images:", err);
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
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result.images));
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
