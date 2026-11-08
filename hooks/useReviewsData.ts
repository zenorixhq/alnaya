"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import initialReviewData from "@/data/clientReviews.json";

export interface ReviewQuote {
  id: string | number;
  author: string;
  location: string;
  piece: string;
  rating?: number;
  quote: string;
}

export interface FeedbackScreenshot {
  id: string;
  title: string;
  customerName: string;
  location: string;
  piece?: string;
  imageUrl: string;
  caption?: string;
  date?: string;
}

export interface VideoReel {
  id: number | string;
  influencer: string;
  handle: string;
  title: string;
  videoUrl: string;
  poster: string;
  views?: string;
  productTitle: string;
  productSlug?: string;
  productPrice?: number;
  badge?: string;
}

export interface InstagramVideo {
  id: string | number;
  title: string;
  poster: string;
  videoUrl?: string;
  instagramUrl?: string;
  embedUrl?: string;
  handle?: string;
  caption?: string;
  views?: string;
  instagramLink?: string;
}

export interface ReviewsData {
  reviews: ReviewQuote[];
  videoReels: VideoReel[];
  feedbackScreenshots: FeedbackScreenshot[];
  instagramVideos: InstagramVideo[];
}

const STORAGE_KEY = "alnaya_reviews_cache_v3";
const STORAGE_TIME_KEY = "alnaya_reviews_cache_time_v3";

// Module-level deduplication promise so multiple components share the in-flight request
let inFlightFetch: Promise<ReviewsData | null> | null = null;

function getInitialReviews(): ReviewsData {
  if (typeof window === "undefined") {
    return initialReviewData as unknown as ReviewsData;
  }
  try {
    // Purge any legacy v2 cache to prevent stale items from sticking
    try {
      sessionStorage.removeItem("alnaya_reviews_cache_v2");
      sessionStorage.removeItem("alnaya_reviews_cache_time");
    } catch (e) {}

    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === "object") {
        return {
          reviews: Array.isArray(parsed.reviews) && parsed.reviews.length > 0 ? parsed.reviews : (initialReviewData.reviews as ReviewQuote[]),
          videoReels: Array.isArray(parsed.videoReels) && parsed.videoReels.length > 0 ? parsed.videoReels : (initialReviewData.videoReels as VideoReel[]),
          feedbackScreenshots: Array.isArray(parsed.feedbackScreenshots) && parsed.feedbackScreenshots.length > 0 ? parsed.feedbackScreenshots : (initialReviewData.feedbackScreenshots as FeedbackScreenshot[]),
          instagramVideos: Array.isArray(parsed.instagramVideos) && parsed.instagramVideos.length > 0 ? parsed.instagramVideos : (initialReviewData.instagramVideos as InstagramVideo[]),
        };
      }
    }
  } catch (e) {}
  return initialReviewData as unknown as ReviewsData;
}

export function useReviewsData() {
  const [data, setData] = useState<ReviewsData>(() => getInitialReviews());
  const hasMounted = useRef(false);

  const fetchFreshReviews = useCallback(async (force = false) => {
    if (!inFlightFetch) {
      inFlightFetch = (async () => {
        try {
          const url = force ? `/api/reviews?t=${Date.now()}` : "/api/reviews";
          const res = await fetch(url);
          if (res.ok) {
            const json = await res.json();
            if (json && typeof json === "object") {
              const freshData: ReviewsData = {
                reviews: Array.isArray(json.reviews) ? json.reviews : (initialReviewData.reviews as ReviewQuote[]),
                videoReels: Array.isArray(json.videoReels) ? json.videoReels : (initialReviewData.videoReels as VideoReel[]),
                feedbackScreenshots: Array.isArray(json.feedbackScreenshots) ? json.feedbackScreenshots : (initialReviewData.feedbackScreenshots as FeedbackScreenshot[]),
                instagramVideos: Array.isArray(json.instagramVideos) ? json.instagramVideos : (initialReviewData.instagramVideos as InstagramVideo[]),
              };

              try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
                sessionStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());
              } catch (e) {}

              return freshData;
            }
          }
        } catch (e) {
          console.warn("Fresh reviews fetch error:", e);
        } finally {
          setTimeout(() => {
            inFlightFetch = null;
          }, 500);
        }
        return null;
      })();
    }

    const fresh = await inFlightFetch;
    if (fresh) {
      setData(fresh);
    }
  }, []);

  useEffect(() => {
    // 1. Immediately fetch fresh reviews in background on mount (SWR)
    fetchFreshReviews();

    // 2. Listen for direct admin update events
    const handleUpdateEvent = () => {
      fetchFreshReviews();
    };

    window.addEventListener("alnaya:reviews-updated", handleUpdateEvent);
    window.addEventListener("storage", handleUpdateEvent);

    return () => {
      window.removeEventListener("alnaya:reviews-updated", handleUpdateEvent);
      window.removeEventListener("storage", handleUpdateEvent);
    };
  }, [fetchFreshReviews]);

  return {
    data,
    reviews: data.reviews,
    videoReels: data.videoReels,
    feedbackScreenshots: data.feedbackScreenshots,
    instagramVideos: data.instagramVideos,
    refresh: fetchFreshReviews,
  };
}
