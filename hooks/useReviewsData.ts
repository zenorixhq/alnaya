"use client";

import { useState, useEffect, useCallback } from "react";
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
}

export interface ReviewsData {
  reviews: ReviewQuote[];
  videoReels: VideoReel[];
  feedbackScreenshots: FeedbackScreenshot[];
  instagramVideos: InstagramVideo[];
}

const STORAGE_KEY = "alnaya_reviews_cache_v2";
const STORAGE_TIME_KEY = "alnaya_reviews_cache_time";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes client cache

// Module-level deduplication promise so 4 components only trigger 1 fetch
let inFlightFetch: Promise<ReviewsData | null> | null = null;

function getCachedReviews(): ReviewsData {
  if (typeof window === "undefined") {
    return initialReviewData as unknown as ReviewsData;
  }
  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === "object") {
        return {
          reviews: Array.isArray(parsed.reviews) ? parsed.reviews : (initialReviewData.reviews as ReviewQuote[]),
          videoReels: Array.isArray(parsed.videoReels) ? parsed.videoReels : (initialReviewData.videoReels as VideoReel[]),
          feedbackScreenshots: Array.isArray(parsed.feedbackScreenshots) ? parsed.feedbackScreenshots : (initialReviewData.feedbackScreenshots as FeedbackScreenshot[]),
          instagramVideos: Array.isArray(parsed.instagramVideos) ? parsed.instagramVideos : (initialReviewData.instagramVideos as InstagramVideo[]),
        };
      }
    }
  } catch (e) {}
  return initialReviewData as unknown as ReviewsData;
}

function isCacheFresh(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const time = sessionStorage.getItem(STORAGE_TIME_KEY);
    if (time && Date.now() - parseInt(time, 10) < CACHE_TTL_MS) {
      return true;
    }
  } catch (e) {}
  return false;
}

export function useReviewsData() {
  const [data, setData] = useState<ReviewsData>(() => getCachedReviews());

  const refresh = useCallback(async (force = false) => {
    if (!force && isCacheFresh()) {
      return;
    }

    if (!inFlightFetch) {
      inFlightFetch = (async () => {
        try {
          const res = await fetch("/api/reviews");
          if (res.ok) {
            const json = await res.json();
            if (json && typeof json === "object") {
              try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(json));
                sessionStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());
              } catch (e) {}
              return json as ReviewsData;
            }
          }
        } catch (e) {
          console.warn("Reviews fetch failed:", e);
        } finally {
          setTimeout(() => {
            inFlightFetch = null;
          }, 1000);
        }
        return null;
      })();
    }

    const result = await inFlightFetch;
    if (result) {
      setData({
        reviews: Array.isArray(result.reviews) && result.reviews.length > 0 ? result.reviews : data.reviews,
        videoReels: Array.isArray(result.videoReels) && result.videoReels.length > 0 ? result.videoReels : data.videoReels,
        feedbackScreenshots: Array.isArray(result.feedbackScreenshots) && result.feedbackScreenshots.length > 0 ? result.feedbackScreenshots : data.feedbackScreenshots,
        instagramVideos: Array.isArray(result.instagramVideos) && result.instagramVideos.length > 0 ? result.instagramVideos : data.instagramVideos,
      });
    }
  }, [data.feedbackScreenshots, data.instagramVideos, data.reviews, data.videoReels]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data,
    reviews: data.reviews,
    videoReels: data.videoReels,
    feedbackScreenshots: data.feedbackScreenshots,
    instagramVideos: data.instagramVideos,
    refresh,
  };
}
