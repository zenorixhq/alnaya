"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { storeConfig } from "@/config/store.config";
import { sampleOrders, categories as defaultCategories } from "@/data/mockData";
import { useProductStore } from "@/store/useProductStore";
import { formatPrice } from "@/lib/utils";
import { Order, OrderStatus, Product, Category } from "@/types/store";
import { RING_SPECIFIC_SIZES, BANGLE_SPECIFIC_SIZES } from "@/lib/productSizes";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Palette,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Image as ImageIcon,
  Upload,
  MessageSquare,
  Video,
  Star,
  Play,
  Globe,
  Mail,
  User,
  Lock,
  KeyRound,
  LogOut,
  Eye,
  EyeOff,
  ShieldCheck,
  Instagram,
  Camera,
  Sparkles,
} from "lucide-react";
import { upload } from "@vercel/blob/client";

export default function AdminDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("alnaya_admin_orders");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return sampleOrders;
  });
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const hasLoaded = useProductStore((s) => s.hasLoaded);
  const isLoading = useProductStore((s) => s.isLoading);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "inventory" | "config" | "reviews" | "collections" | "reels">("inventory");
  const [searchQuery, setSearchQuery] = useState("");

  // Curated Collections (Category Cards) State
  const [categoriesList, setCategoriesList] = useState<Category[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("alnaya_categories");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return defaultCategories;
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    image: "",
  });
  const [updatingCatId, setUpdatingCatId] = useState<string | null>(null);

  // Reviews, Video Reels, Screenshots & Instagram Videos State
  const [reviewsList, setReviewsList] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("alnaya_admin_reviews");
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return [];
  });
  const [videosList, setVideosList] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("alnaya_admin_videos");
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return [];
  });
  const [feedbackScreenshotsList, setFeedbackScreenshotsList] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("alnaya_admin_screenshots");
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return [];
  });
  const [instagramVideosList, setInstagramVideosList] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("alnaya_admin_instavideos");
        if (cached && !cached.toLowerCase().includes("gleamnest")) return JSON.parse(cached);
        sessionStorage.removeItem("alnaya_admin_instavideos");
      } catch (e) {}
    }
    return [];
  });
  const [editingInstaVideo, setEditingInstaVideo] = useState<any | null>(null);
  const [updatingInstaVideoId, setUpdatingInstaVideoId] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);
  const [isInstaVideoModalOpen, setIsInstaVideoModalOpen] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    author: "",
    location: "Kerala, India",
    piece: "",
    rating: 5,
    quote: "",
  });

  const [screenshotForm, setScreenshotForm] = useState({
    title: "WhatsApp / DM Customer Review",
    customerName: "",
    location: "Kerala, India",
    piece: "",
    imageUrl: "",
    caption: "",
    date: "Verified Recent Buyer",
  });

  const [instaVideoForm, setInstaVideoForm] = useState({
    title: "Jewelry Styling Reel",
    handle: "@alnaya.in",
    caption: "",
    videoUrl: "",
    poster: "",
    instagramLink: "",
  });

  const [videoForm, setVideoForm] = useState({
    influencer: "",
    handle: "",
    title: "",
    videoUrl: "",
    poster: "",
    productTitle: "",
    productSlug: "",
    productPrice: 150,
  });

  // Modal states for Product Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [formState, setFormState] = useState<{
    title: string;
    category: string;
    price: string;
    salePrice: string;
    priceQatar: string;
    salePriceQatar: string;
    stockCount: string;
    shortDescription: string;
    description: string;
    imageUrl: string;
    featured: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    sizingType: "adjustable" | "sizes";
    selectedSizes: string[];
    sizeStock: Record<string, number>;
  }>({
    title: "",
    category: "necklaces-and-chains",
    price: "",
    salePrice: "",
    priceQatar: "",
    salePriceQatar: "",
    stockCount: "10",
    shortDescription: "",
    description: "",
    imageUrl: "",
    featured: false,
    isBestSeller: false,
    isNewArrival: true,
    sizingType: "adjustable",
    selectedSizes: [...RING_SPECIFIC_SIZES],
    sizeStock: {},
  });

  const fetchReviewsAndVideos = () => {
    fetch(`/api/reviews?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.reviews)) {
          setReviewsList(data.reviews);
          try { sessionStorage.setItem("alnaya_admin_reviews", JSON.stringify(data.reviews)); } catch (e) {}
        }
        if (Array.isArray(data.videoReels)) {
          setVideosList(data.videoReels);
          try { sessionStorage.setItem("alnaya_admin_videos", JSON.stringify(data.videoReels)); } catch (e) {}
        }
        if (Array.isArray(data.feedbackScreenshots)) {
          setFeedbackScreenshotsList(data.feedbackScreenshots);
          try { sessionStorage.setItem("alnaya_admin_screenshots", JSON.stringify(data.feedbackScreenshots)); } catch (e) {}
        }
        if (Array.isArray(data.instagramVideos)) {
          const cleanInsta = data.instagramVideos.map((v: any) => ({
            ...v,
            handle: "@alnaya.in",
            caption: (v.caption || "").replace(/gleamnest/gi, "alnaya").replace(/304\s*(&|and)\s*306/gi, "radiant finish"),
            title: (v.title || "").replace(/gleamnest/gi, "alnaya"),
            instagramLink: (v.instagramLink || "").replace(/gleamnest/gi, "alnaya"),
          }));
          setInstagramVideosList(cleanInsta);
          try { sessionStorage.setItem("alnaya_admin_instavideos", JSON.stringify(cleanInsta)); } catch (e) {}
        }
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  };

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoriesList(data);
          try { sessionStorage.setItem("alnaya_categories", JSON.stringify(data)); } catch (e) {}
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  };

  useEffect(() => {
    // Check if merchant is already authenticated
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("alnaya_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    // Accepted Merchant Credentials:
    // Username: admin@alnaya.in or admin
    // Password: alnaya@2026 or Alnaya@2026
    if (
      (cleanEmail === "admin@alnaya.in" || cleanEmail === "admin" || cleanEmail === "alnaya") &&
      (cleanPassword === "alnaya@2026" || cleanPassword === "Alnaya@2026" || cleanPassword === "alnaya2026")
    ) {
      localStorage.setItem("alnaya_admin_auth", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid merchant credentials. Please verify your username and password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("alnaya_admin_auth");
    setIsAuthenticated(false);
    setLoginPassword("");
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchReviewsAndVideos();
      fetchCategories();

      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setOrders(data);
            try { sessionStorage.setItem("alnaya_admin_orders", JSON.stringify(data)); } catch (e) {}
          }
        })
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [isAuthenticated, fetchProducts]);

  // Calculate high-level KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o?.grandTotal || 0), 0);
  const totalOrdersCount = orders.length;
  const aov = totalRevenue / (totalOrdersCount || 1);
  const totalStockUnits = products.reduce((sum, p) => sum + p.stockCount, 0);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to persist order status:", err);
    }
  };

  // Media Upload & Saving States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [isSavingItem, setIsSavingItem] = useState(false);

  // Media Optimization & Upload
  const compressImageIfNeeded = async (file: File, maxDim = 1400, quality = 0.82): Promise<File> => {
    if (!file.type.startsWith("image/")) return file;
    // Don't re-encode vector or animated images
    if (file.type === "image/svg+xml" || file.type === "image/gif") return file;
    // Already lightweight and compact
    if (file.size <= 100 * 1024) return file;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // WebP delivers 30-40% smaller file size with zero perceptible quality loss
          const supportsWebp = canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
          const targetMime = supportsWebp ? "image/webp" : "image/jpeg";
          const targetExt = supportsWebp ? ".webp" : ".jpg";

          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const cleanBase = file.name.replace(/\.[^.]+$/, "");
                const optimized = new File([blob], `${cleanBase}${targetExt}`, {
                  type: targetMime,
                  lastModified: Date.now(),
                });
                resolve(optimized);
              } else {
                resolve(file);
              }
            },
            targetMime,
            quality
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const generateVideoPoster = async (file: File): Promise<File | null> => {
    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|mov|webm|m4v)$/i)) {
      return null;
    }
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const videoUrl = URL.createObjectURL(file);
      video.src = videoUrl;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";
      video.preload = "auto";

      const cleanup = () => {
        URL.revokeObjectURL(videoUrl);
        video.remove();
      };

      const timeout = setTimeout(() => {
        cleanup();
        resolve(null);
      }, 7000);

      video.onloadeddata = () => {
        // Seek to 0.5s or 15% to grab an active preview frame (avoid initial black frame)
        const targetTime = Math.min(1.0, (video.duration || 2) * 0.15);
        video.currentTime = targetTime;
      };

      video.onseeked = () => {
        try {
          const width = video.videoWidth || 720;
          const height = video.videoHeight || 1280;
          const maxDim = 1000;
          let targetW = width;
          let targetH = height;
          if (targetW > maxDim || targetH > maxDim) {
            if (targetW > targetH) {
              targetH = Math.round((height * maxDim) / width);
              targetW = maxDim;
            } else {
              targetW = Math.round((width * maxDim) / height);
              targetH = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            clearTimeout(timeout);
            cleanup();
            resolve(null);
            return;
          }

          ctx.drawImage(video, 0, 0, targetW, targetH);
          canvas.toBlob(
            (blob) => {
              clearTimeout(timeout);
              cleanup();
              if (blob) {
                const cleanBase = file.name.replace(/\.[^.]+$/, "");
                const posterFile = new File([blob], `${cleanBase}-poster.jpg`, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(posterFile);
              } else {
                resolve(null);
              }
            },
            "image/jpeg",
            0.82
          );
        } catch (e) {
          clearTimeout(timeout);
          cleanup();
          resolve(null);
        }
      };

      video.onerror = () => {
        clearTimeout(timeout);
        cleanup();
        resolve(null);
      };
    });
  };

  const compressVideoIfNeeded = async (
    file: File,
    onProgress?: (percent: number, currentMB: number, targetMB: number) => void
  ): Promise<File> => {
    // Only compress video files larger than 2.5 MB
    const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm|m4v|avi|mkv)$/i);
    if (!isVideo) return file;
    if (file.size <= 2.5 * 1024 * 1024) return file;

    // Check browser MediaRecorder and Canvas captureStream support
    if (typeof window === "undefined" || !window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
      console.warn("Browser does not support in-browser video compression. Skipping.");
      return file;
    }

    return new Promise((resolve) => {
      // 45-second fallback timeout
      const timeout = setTimeout(() => {
        console.warn("Video compression timed out, proceeding with original file.");
        resolve(file);
      }, 45000);

      const video = document.createElement("video");
      const videoUrl = URL.createObjectURL(file);
      video.src = videoUrl;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";
      video.preload = "auto";

      video.onloadedmetadata = async () => {
        try {
          const origWidth = video.videoWidth || 1280;
          const origHeight = video.videoHeight || 720;
          const duration = video.duration || 10;

          // Skip client compression if video is extremely long (> 120s) to avoid freezing UI
          if (duration > 120) {
            clearTimeout(timeout);
            URL.revokeObjectURL(videoUrl);
            resolve(file);
            return;
          }

          // Target 720p maximum resolution with preserved aspect ratio
          const isPortrait = origHeight > origWidth;
          const maxLongDim = 1280;
          const maxShortDim = 720;

          let targetWidth = origWidth;
          let targetHeight = origHeight;

          if (isPortrait) {
            if (targetWidth > maxShortDim) {
              targetHeight = Math.round((origHeight * maxShortDim) / origWidth);
              targetWidth = maxShortDim;
            }
            if (targetHeight > maxLongDim) {
              targetWidth = Math.round((targetWidth * maxLongDim) / targetHeight);
              targetHeight = maxLongDim;
            }
          } else {
            if (targetWidth > maxLongDim) {
              targetHeight = Math.round((origHeight * maxLongDim) / origWidth);
              targetWidth = maxLongDim;
            }
            if (targetHeight > maxShortDim) {
              targetWidth = Math.round((targetWidth * maxShortDim) / targetHeight);
              targetHeight = maxShortDim;
            }
          }

          // Codecs strictly require even dimensions
          targetWidth = Math.max(2, Math.floor(targetWidth / 2) * 2);
          targetHeight = Math.max(2, Math.floor(targetHeight / 2) * 2);

          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext("2d", { alpha: false });
          if (!ctx) {
            clearTimeout(timeout);
            URL.revokeObjectURL(videoUrl);
            resolve(file);
            return;
          }

          // Capture canvas stream at 30fps
          const canvasStream = canvas.captureStream(30);

          // Capture audio from video element if available
          try {
            const vidElementStream = (video as any).captureStream
              ? (video as any).captureStream()
              : (video as any).mozCaptureStream
              ? (video as any).mozCaptureStream()
              : null;

            if (vidElementStream) {
              const audioTracks = vidElementStream.getAudioTracks();
              if (audioTracks && audioTracks.length > 0) {
                canvasStream.addTrack(audioTracks[0]);
              }
            }
          } catch (audioErr) {
            console.warn("Could not capture audio track:", audioErr);
          }

          // Determine optimal supported mime type
          const candidateMimes = [
            "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
            "video/mp4",
            "video/webm;codecs=vp9,opus",
            "video/webm;codecs=vp8,opus",
            "video/webm",
          ];
          let chosenMime = "";
          let chosenExt = ".webm";
          for (const m of candidateMimes) {
            if (MediaRecorder.isTypeSupported(m)) {
              chosenMime = m;
              chosenExt = m.includes("mp4") ? ".mp4" : ".webm";
              break;
            }
          }

          // Bitrate: ~1.4 Mbps video bitrate yields crystal clear 720p reels at ~1.5 - 2.8 MB
          const targetBitrate = 1400000;
          let mediaRecorder: MediaRecorder;
          try {
            mediaRecorder = new MediaRecorder(canvasStream, {
              ...(chosenMime ? { mimeType: chosenMime } : {}),
              videoBitsPerSecond: targetBitrate,
            });
          } catch (e) {
            mediaRecorder = new MediaRecorder(canvasStream);
          }

          const chunks: Blob[] = [];
          mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              chunks.push(e.data);
            }
          };

          let isDone = false;
          const finish = () => {
            if (isDone) return;
            isDone = true;
            clearTimeout(timeout);
            URL.revokeObjectURL(videoUrl);

            try {
              const outputBlob = new Blob(chunks, { type: chosenMime || "video/webm" });
              if (outputBlob.size < file.size && outputBlob.size > 10000) {
                const cleanBase = file.name.replace(/\.[^.]+$/, "");
                const compressedFile = new File([outputBlob], `${cleanBase}-opt${chosenExt}`, {
                  type: (chosenMime || "video/webm").split(";")[0],
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            } catch (err) {
              resolve(file);
            }
          };

          mediaRecorder.onstop = finish;
          mediaRecorder.onerror = () => {
            clearTimeout(timeout);
            URL.revokeObjectURL(videoUrl);
            resolve(file);
          };

          mediaRecorder.start(250);

          let animId: number;
          const render = () => {
            if (video.paused || video.ended) return;
            ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

            if (duration > 0 && onProgress) {
              const pct = Math.min(99, Math.round((video.currentTime / duration) * 100));
              const curMB = file.size / (1024 * 1024);
              const estMB = Math.max(0.8, (targetBitrate * duration) / (8 * 1024 * 1024));
              onProgress(pct, curMB, estMB);
            }

            if ("requestVideoFrameCallback" in video) {
              (video as any).requestVideoFrameCallback(render);
            } else {
              animId = requestAnimationFrame(render);
            }
          };

          video.onended = () => {
            cancelAnimationFrame(animId);
            setTimeout(() => {
              if (mediaRecorder.state !== "inactive") {
                mediaRecorder.stop();
              }
            }, 200);
          };

          video.onerror = () => {
            clearTimeout(timeout);
            URL.revokeObjectURL(videoUrl);
            resolve(file);
          };

          await video.play();
          render();
        } catch (err) {
          console.warn("Video compression encountered error, using original file:", err);
          clearTimeout(timeout);
          URL.revokeObjectURL(videoUrl);
          resolve(file);
        }
      };

      video.onerror = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(videoUrl);
        resolve(file);
      };
    });
  };

  const uploadFileToServer = async (file: File, folder: "screenshots" | "videos" | "images") => {
    setIsUploading(true);
    try {
      let fileToUpload = file;

      // 1. Convert images to low size immediately (crisp 1400px, 0.82 WebP/JPEG, ~80-160KB)
      if (file.type.startsWith("image/") && file.size > 100 * 1024) {
        const origSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setUploadProgressText(`Optimizing image (${origSizeMB} MB ➔ converting to fast web format)...`);
        fileToUpload = await compressImageIfNeeded(file);
        const newSizeKB = Math.round(fileToUpload.size / 1024);
        setUploadProgressText(`Image optimized to ${newSizeKB} KB! Uploading...`);
      }
      // 2. Convert videos to low size immediately (720p 30fps ~1.4Mbps, ~1.5 - 3MB)
      else if ((file.type.startsWith("video/") || folder === "videos") && file.size > 2.5 * 1024 * 1024) {
        const origSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        setUploadProgressText(`Compressing video (original: ${origSizeMB} MB ➔ converting to fast web video)...`);
        fileToUpload = await compressVideoIfNeeded(file, (percent, curMB, tgtMB) => {
          setUploadProgressText(`Compressing video: ${percent}% (reducing ${curMB.toFixed(1)} MB to ~${tgtMB.toFixed(1)} MB)...`);
        });
        const newSizeMB = (fileToUpload.size / (1024 * 1024)).toFixed(1);
        setUploadProgressText(`Video compressed to ${newSizeMB} MB! Uploading to cloud...`);
      } else {
        setUploadProgressText(`Uploading ${fileToUpload.name}...`);
      }

      // 1. Direct client-to-cloud Vercel Blob upload (supports files up to 150MB directly to CDN)
      try {
        const cleanName = `${folder}/${Date.now()}-${fileToUpload.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const newBlob = await upload(cleanName, fileToUpload, {
          access: "public",
          handleUploadUrl: "/api/upload/blob",
        });
        if (newBlob && newBlob.url) {
          return newBlob.url;
        }
      } catch (blobErr: any) {
        console.warn("Direct blob upload unavailable, trying server API route:", blobErr?.message);
      }

      // 2. Server API route upload fallback
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.status === 413) {
        throw new Error(
          "Video file exceeds the serverless limit. Please enable Vercel Blob in your Vercel Dashboard (Storage -> Create Blob) for unlimited uploads up to 150MB, or paste an Instagram / direct video URL."
        );
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }
      return data.url as string;
    } finally {
      setIsUploading(false);
      setUploadProgressText("");
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author.trim() || !reviewForm.quote.trim()) {
      alert("Please enter author name and review quote.");
      return;
    }
    setIsSavingItem(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reviewForm, type: "review" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add review");
      }
      setIsReviewModalOpen(false);
      setReviewForm({ author: "", location: "Kerala, India", piece: "", rating: 5, quote: "" });
      fetchReviewsAndVideos();
    } catch (err: any) {
      alert(err.message || "Error adding review");
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteReview = async (id: string | number) => {
    if (!confirm("Are you sure you want to remove this client review?")) return;
    try {
      const targetId = String(id).trim();
      setReviewsList((prev) => {
        const next = prev.filter((r) => String(r.id).trim() !== targetId);
        try { sessionStorage.setItem("alnaya_admin_reviews", JSON.stringify(next)); } catch (e) {}
        return next;
      });
      const res = await fetch(`/api/reviews?type=review&id=${encodeURIComponent(targetId)}`, {
        method: "DELETE",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete review");
      }
      if (Array.isArray(data.reviews)) {
        setReviewsList(data.reviews);
        try { sessionStorage.setItem("alnaya_admin_reviews", JSON.stringify(data.reviews)); } catch (e) {}
      }
    } catch (err: any) {
      alert(err.message || "Error deleting review");
      fetchReviewsAndVideos();
    }
  };

  // Video Reel File Upload Handlers
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 150 * 1024 * 1024) {
      alert("Video file is larger than 150MB. Please choose a smaller video clip.");
      return;
    }

    try {
      // Auto-extract thumbnail poster from video if none is set
      if (!videoForm.poster) {
        generateVideoPoster(file).then(async (posterFile) => {
          if (posterFile) {
            try {
              const posterUrl = await uploadFileToServer(posterFile, "images");
              if (posterUrl) {
                setVideoForm((prev) => ({ ...prev, poster: prev.poster || posterUrl }));
              }
            } catch (pErr) {
              console.warn("Poster auto-upload skipped:", pErr);
            }
          }
        });
      }

      const publicUrl = await uploadFileToServer(file, "videos");
      setVideoForm((prev) => ({ ...prev, videoUrl: publicUrl }));
    } catch (err: any) {
      alert("Video Upload Notice: " + (err.message || "Upload failed") + "\n\nTip: You can also paste an Instagram Reel or direct video URL.");
    } finally {
      e.target.value = "";
    }
  };

  const handleVideoPosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const publicUrl = await uploadFileToServer(file, "images");
      setVideoForm((prev) => ({ ...prev, poster: publicUrl }));
    } catch (err: any) {
      alert("Error uploading thumbnail: " + (err.message || "Upload failed"));
    } finally {
      e.target.value = "";
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim() || !videoForm.videoUrl.trim()) {
      alert("Please enter video title and provide a video (upload file or enter URL).");
      return;
    }
    setIsSavingItem(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...videoForm, type: "video" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add video reel");
      }
      setIsVideoModalOpen(false);
      setVideoForm({
        influencer: "",
        handle: "",
        title: "",
        videoUrl: "",
        poster: "",
        productTitle: "",
        productSlug: "",
        productPrice: 150,
      });
      fetchReviewsAndVideos();
    } catch (err: any) {
      alert(err.message || "Error adding video reel");
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteVideo = async (id: string | number) => {
    if (!confirm("Are you sure you want to remove this video reel?")) return;
    try {
      const targetId = String(id).trim();
      setVideosList((prev) => {
        const next = prev.filter((v) => String(v.id).trim() !== targetId);
        try { sessionStorage.setItem("alnaya_admin_videos", JSON.stringify(next)); } catch (e) {}
        return next;
      });
      const res = await fetch(`/api/reviews?type=video&id=${encodeURIComponent(targetId)}`, {
        method: "DELETE",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete video reel");
      }
      if (Array.isArray(data.videoReels)) {
        setVideosList(data.videoReels);
        try { sessionStorage.setItem("alnaya_admin_videos", JSON.stringify(data.videoReels)); } catch (e) {}
      }
    } catch (err: any) {
      alert(err.message || "Error deleting video reel");
      fetchReviewsAndVideos();
    }
  };

  // Feedback Screenshot Handlers
  const handleScreenshotFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("Screenshot is larger than 25MB. Please choose a smaller image.");
      return;
    }

    try {
      const publicUrl = await uploadFileToServer(file, "screenshots");
      setScreenshotForm((prev) => ({ ...prev, imageUrl: publicUrl }));
    } catch (err: any) {
      alert("Error uploading screenshot: " + (err.message || "Upload failed"));
    } finally {
      e.target.value = "";
    }
  };

  const handleAddScreenshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotForm.imageUrl.trim()) {
      alert("Please upload a screenshot from your device or paste an image URL.");
      return;
    }
    setIsSavingItem(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...screenshotForm, type: "screenshot" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save screenshot");
      }
      setIsScreenshotModalOpen(false);
      setScreenshotForm({
        title: "WhatsApp / DM Customer Review",
        customerName: "",
        location: "Kerala, India",
        piece: "",
        imageUrl: "",
        caption: "",
        date: "Verified Recent Buyer",
      });
      fetchReviewsAndVideos();
    } catch (err: any) {
      alert(err.message || "Error saving client feedback screenshot");
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteScreenshot = async (id: string | number) => {
    if (!confirm("Are you sure you want to remove this client feedback screenshot?")) return;
    try {
      const targetId = String(id).trim();
      setFeedbackScreenshotsList((prev) => {
        const next = prev.filter((s) => String(s.id).trim() !== targetId);
        try { sessionStorage.setItem("alnaya_admin_screenshots", JSON.stringify(next)); } catch (e) {}
        return next;
      });
      const res = await fetch(`/api/reviews?type=screenshot&id=${encodeURIComponent(targetId)}`, {
        method: "DELETE",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete feedback screenshot");
      }
      if (Array.isArray(data.feedbackScreenshots)) {
        setFeedbackScreenshotsList(data.feedbackScreenshots);
        try { sessionStorage.setItem("alnaya_admin_screenshots", JSON.stringify(data.feedbackScreenshots)); } catch (e) {}
      }
    } catch (err: any) {
      alert(err.message || "Error deleting feedback screenshot");
      fetchReviewsAndVideos();
    }
  };

  // Instagram Video ("Follow The House") Handlers
  const handleInstaCardVideoUpload = async (videoId: string | number, file: File) => {
    setUpdatingInstaVideoId(String(videoId));
    try {
      const publicUrl = await uploadFileToServer(file, "videos");
      if (!publicUrl) throw new Error("Video upload failed");

      // Auto-extract thumbnail poster from video if none was previously set
      let autoPosterUrl: string | undefined;
      const videoToUpdate = instagramVideosList.find((v) => String(v.id) === String(videoId));
      if (!videoToUpdate?.poster) {
        try {
          const posterFile = await generateVideoPoster(file);
          if (posterFile) {
            autoPosterUrl = await uploadFileToServer(posterFile, "images");
          }
        } catch (pErr) {
          console.warn("Auto-poster upload skipped:", pErr);
        }
      }

      // Update state locally
      setInstagramVideosList((prev) =>
        prev.map((v) =>
          String(v.id) === String(videoId)
            ? { ...v, videoUrl: publicUrl, ...(autoPosterUrl ? { poster: autoPosterUrl } : {}) }
            : v
        )
      );

      // Persist to DB via PUT /api/reviews
      await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(videoToUpdate || {}),
          id: videoId,
          type: "instagramVideo",
          videoUrl: publicUrl,
          ...(autoPosterUrl ? { poster: autoPosterUrl } : {}),
        }),
      });

      fetchReviewsAndVideos();
    } catch (err: any) {
      console.error("Failed to upload video reel:", err);
      alert("Failed to upload video: " + (err?.message || "Unknown error"));
    } finally {
      setUpdatingInstaVideoId(null);
    }
  };

  const handleInstaCardPosterUpload = async (videoId: string | number, file: File) => {
    setUpdatingInstaVideoId(String(videoId));
    try {
      const publicUrl = await uploadFileToServer(file, "images");
      if (!publicUrl) throw new Error("Image upload failed");

      // Update state locally
      setInstagramVideosList((prev) =>
        prev.map((v) => (String(v.id) === String(videoId) ? { ...v, poster: publicUrl } : v))
      );

      // Persist to DB via PUT /api/reviews
      const videoToUpdate = instagramVideosList.find((v) => String(v.id) === String(videoId));
      await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(videoToUpdate || {}),
          id: videoId,
          type: "instagramVideo",
          poster: publicUrl,
        }),
      });

      fetchReviewsAndVideos();
    } catch (err: any) {
      console.error("Failed to upload poster:", err);
      alert("Failed to upload cover image: " + (err?.message || "Unknown error"));
    } finally {
      setUpdatingInstaVideoId(null);
    }
  };

  const handleOpenAddInstaVideo = () => {
    setEditingInstaVideo(null);
    setInstaVideoForm({
      title: "",
      handle: "@alnaya.in",
      caption: "",
      videoUrl: "",
      poster: "",
      instagramLink: "https://www.instagram.com/alnaya.in?psln=cDNzY3liNjltb203",
    });
    setIsInstaVideoModalOpen(true);
  };

  const handleOpenEditInstaVideo = (video: any) => {
    setEditingInstaVideo(video);
    setInstaVideoForm({
      title: video.title || "",
      handle: video.handle || "@alnaya.in",
      caption: video.caption || "",
      videoUrl: video.videoUrl || "",
      poster: video.poster || "",
      instagramLink: video.instagramLink || "",
    });
    setIsInstaVideoModalOpen(true);
  };

  const handleInstaVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 150 * 1024 * 1024) {
      alert("Video file is larger than 150MB. Please choose a smaller video clip.");
      return;
    }

    try {
      // Auto-extract thumbnail poster from video if none is set
      if (!instaVideoForm.poster) {
        generateVideoPoster(file).then(async (posterFile) => {
          if (posterFile) {
            try {
              const posterUrl = await uploadFileToServer(posterFile, "images");
              if (posterUrl) {
                setInstaVideoForm((prev) => ({ ...prev, poster: prev.poster || posterUrl }));
              }
            } catch (pErr) {
              console.warn("Auto-poster upload skipped:", pErr);
            }
          }
        });
      }

      const publicUrl = await uploadFileToServer(file, "videos");
      setInstaVideoForm((prev) => ({ ...prev, videoUrl: publicUrl }));
    } catch (err: any) {
      alert("Video Upload Notice: " + (err.message || "Upload failed") + "\n\nTip: You can also paste an Instagram Reel or direct video URL.");
    } finally {
      e.target.value = "";
    }
  };

  const handleInstaPosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const publicUrl = await uploadFileToServer(file, "images");
      setInstaVideoForm((prev) => ({ ...prev, poster: publicUrl }));
    } catch (err: any) {
      alert("Error uploading thumbnail: " + (err.message || "Upload failed"));
    } finally {
      e.target.value = "";
    }
  };

  const handleAddInstaVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instaVideoForm.videoUrl.trim()) {
      alert("Please provide the Instagram Reel link or upload a video reel.");
      return;
    }
    setIsSavingItem(true);
    try {
      if (editingInstaVideo) {
        // PUT
        const res = await fetch("/api/reviews", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...instaVideoForm,
            id: editingInstaVideo.id,
            type: "instagramVideo",
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to update Instagram video");
        }
      } else {
        // POST
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...instaVideoForm, type: "instagramVideo" }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to add Instagram video");
        }
      }
      setIsInstaVideoModalOpen(false);
      setEditingInstaVideo(null);
      setInstaVideoForm({
        title: "Jewelry Styling Reel",
        handle: "@alnaya.in",
        caption: "",
        videoUrl: "",
        poster: "",
        instagramLink: "",
      });
      fetchReviewsAndVideos();
    } catch (err: any) {
      alert(err.message || "Error saving Instagram video");
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteInstaVideo = async (id: string | number) => {
    if (!confirm("Are you sure you want to remove this reel from Follow The House?")) return;
    try {
      const targetId = String(id).trim();
      const updatedList = instagramVideosList.filter((v) => String(v.id).trim() !== targetId);
      setInstagramVideosList(updatedList);
      try {
        sessionStorage.setItem("alnaya_admin_instavideos", JSON.stringify(updatedList));
        localStorage.setItem("alnaya_follow_house_updated", String(Date.now()));
        window.dispatchEvent(new Event("storage"));
      } catch (e) {}

      const res = await fetch(`/api/reviews?type=instagramVideo&id=${encodeURIComponent(targetId)}`, {
        method: "DELETE",
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete reel");
      }
      if (Array.isArray(data.instagramVideos)) {
        const cleanInsta = data.instagramVideos.map((v: any) => ({
          ...v,
          handle: "@alnaya.in",
          caption: (v.caption || "").replace(/gleamnest/gi, "alnaya").replace(/304\s*(&|and)\s*306/gi, "radiant finish"),
          title: (v.title || "").replace(/gleamnest/gi, "alnaya"),
          instagramLink: (v.instagramLink || "").replace(/gleamnest/gi, "alnaya"),
        }));
        setInstagramVideosList(cleanInsta);
        try {
          sessionStorage.setItem("alnaya_admin_instavideos", JSON.stringify(cleanInsta));
          localStorage.setItem("alnaya_follow_house_updated", String(Date.now()));
          window.dispatchEvent(new Event("storage"));
        } catch (e) {}
      }
    } catch (err: any) {
      alert(err.message || "Error deleting reel");
      fetchReviewsAndVideos();
    }
  };

  // Curated Collections / Category Cards Handlers
  const handleCategoryCardImageUpload = async (catId: string, file: File) => {
    setUpdatingCatId(catId);
    try {
      const imageUrl = await uploadFileToServer(file, "images");
      if (!imageUrl) throw new Error("Image upload failed");

      // Update state immediately
      setCategoriesList((prev) =>
        prev.map((c) => (c.id === catId ? { ...c, image: imageUrl } : c))
      );

      // Persist to Neon PostgreSQL via PUT /api/categories
      const catToUpdate = categoriesList.find((c) => c.id === catId);
      const res = await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(catToUpdate || {}),
          id: catId,
          image: imageUrl,
        }),
      });

      const data = await res.json();
      if (Array.isArray(data.categories)) {
        setCategoriesList(data.categories);
      }
    } catch (err: any) {
      console.error("Failed to update category card image:", err);
      alert("Failed to upload and update category image: " + (err?.message || "Unknown error"));
    } finally {
      setUpdatingCatId(null);
    }
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image,
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      id: `cat-${Date.now()}`,
      name: "",
      slug: "",
      description: "",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    });
    setIsCategoryModalOpen(true);
  };

  const handleCategoryModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const publicUrl = await uploadFileToServer(file, "images");
      setCategoryForm((prev) => ({ ...prev, image: publicUrl }));
    } catch (err: any) {
      alert("Image upload notice: " + (err.message || "Failed to upload image"));
    } finally {
      e.target.value = "";
    }
  };

  const handleSaveCategoryModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim() || !categoryForm.slug.trim()) {
      alert("Category name and slug are required.");
      return;
    }
    setIsSavingItem(true);
    try {
      if (editingCategory) {
        const res = await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryForm),
        });
        const data = await res.json();
        if (Array.isArray(data.categories)) {
          setCategoriesList(data.categories);
        } else {
          setCategoriesList((prev) =>
            prev.map((c) => (c.id === categoryForm.id ? { ...c, ...categoryForm } : c))
          );
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryForm),
        });
        const data = await res.json();
        if (Array.isArray(data.categories)) {
          setCategoriesList(data.categories);
        } else {
          setCategoriesList((prev) => [...prev, { ...categoryForm, productCount: 0 }]);
        }
      }
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      console.error("Error saving category:", err);
      alert("Failed to save category card: " + (err?.message || "Unknown error"));
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm("Are you sure you want to remove this category card from the homepage?")) return;
    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(catId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (Array.isArray(data.categories)) {
        setCategoriesList(data.categories);
      } else {
        setCategoriesList((prev) => prev.filter((c) => c.id !== catId));
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleStockAdjust = async (productId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stockCount + delta);
    await updateProduct(productId, {
      stockCount: newStock,
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    const initialRingSizes = [...RING_SPECIFIC_SIZES];
    const initialSizeStock: Record<string, number> = {};
    initialRingSizes.forEach((s) => {
      initialSizeStock[s] = 1;
    });

    setFormState({
      title: "",
      category: "necklaces-and-chains",
      price: "",
      salePrice: "",
      priceQatar: "",
      salePriceQatar: "",
      stockCount: "10",
      shortDescription: "",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
      featured: false,
      isBestSeller: false,
      isNewArrival: true,
      sizingType: "adjustable",
      selectedSizes: initialRingSizes,
      sizeStock: initialSizeStock,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    const suggestedQar = product.priceQatar !== undefined && product.priceQatar !== null
      ? product.priceQatar.toString()
      : Math.max(10, Math.round(product.price / 20)).toString();

    // Detect existing sizing configuration (adjustable vs specific sizes)
    const explicitSizeAttr = product.variantAttributes?.find((a) => /size/i.test(a.name));
    let detectedSizingType: "adjustable" | "sizes" = "adjustable";

    const isRing = product.category === "rings";
    const isBangle = product.category === "bangles-kada";
    const standardSizes = isRing ? RING_SPECIFIC_SIZES : isBangle ? BANGLE_SPECIFIC_SIZES : [];

    let selectedSizes: string[] = [];
    let sizeStock: Record<string, number> = {};

    if (explicitSizeAttr && explicitSizeAttr.options?.length > 0) {
      const isAdj =
        explicitSizeAttr.options.length === 1 &&
        /adjustable|free size|cuff|openable/i.test(explicitSizeAttr.options[0]);
      detectedSizingType = isAdj ? "adjustable" : "sizes";

      const cleaned = explicitSizeAttr.options.filter(
        (o) => !/adjustable|free size|cuff|openable/i.test(o)
      );
      selectedSizes = cleaned.length > 0 ? cleaned : [...standardSizes];

      if (explicitSizeAttr.sizeStock) {
        sizeStock = { ...explicitSizeAttr.sizeStock };
      } else {
        const fallbackCount = Math.max(0, product.stockCount ?? 1);
        selectedSizes.forEach((s) => {
          sizeStock[s] = fallbackCount;
        });
      }
    } else {
      const titleIndicatesAdjustable =
        /\b(adjustable|free size|openable|cuff)\b/i.test(product.title) ||
        /\b(adjustable|free size|openable|cuff)\b/i.test(product.description || "") ||
        (product.tags && product.tags.some((t) => /\b(adjustable|free size)\b/i.test(t)));
      detectedSizingType = titleIndicatesAdjustable ? "adjustable" : "sizes";
      selectedSizes = [...standardSizes];
      const fallbackCount = Math.max(0, product.stockCount ?? 1);
      standardSizes.forEach((s) => {
        sizeStock[s] = fallbackCount;
      });
    }

    // Ensure all standard sizes have a non-undefined entry in sizeStock
    standardSizes.forEach((s) => {
      if (sizeStock[s] === undefined) {
        sizeStock[s] = 0;
      }
    });

    setFormState({
      title: product.title,
      category: product.category,
      price: product.price.toString(),
      salePrice: product.salePrice ? product.salePrice.toString() : "",
      priceQatar: suggestedQar,
      salePriceQatar: product.salePriceQatar ? product.salePriceQatar.toString() : "",
      stockCount: product.stockCount.toString(),
      shortDescription: product.shortDescription,
      description: product.description,
      imageUrl: product.images[0] || "",
      featured: !!product.featured,
      isBestSeller: !!product.isBestSeller,
      isNewArrival: !!product.isNewArrival,
      sizingType: detectedSizingType,
      selectedSizes,
      sizeStock,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product from your catalog?")) {
      await deleteProduct(productId);
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert("Image is larger than 25MB. Please choose a smaller image.");
      return;
    }

    try {
      const publicUrl = await uploadFileToServer(file, "images");
      setFormState((prev) => ({ ...prev, imageUrl: publicUrl }));
    } catch (err: any) {
      alert("Error uploading image: " + (err.message || "Upload failed"));
    } finally {
      e.target.value = "";
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.title.trim() || !formState.price) {
      alert("Please fill in the product title and price.");
      return;
    }

    setIsSaving(true);
    try {
      const parsedPriceInr = parseFloat(formState.price);
      const parsedSalePriceInr = formState.salePrice ? parseFloat(formState.salePrice) : undefined;
      const parsedPriceQar = formState.priceQatar
        ? parseFloat(formState.priceQatar)
        : Math.max(10, Math.round(parsedPriceInr / 20));
      const parsedSalePriceQar = formState.salePriceQatar ? parseFloat(formState.salePriceQatar) : undefined;

      // Construct sizing variants for rings or bangles
      let variantAttributes = editingProduct?.variantAttributes
        ? [...editingProduct.variantAttributes]
        : [];

      let finalStockCount = Math.max(0, parseInt(formState.stockCount) || 0);

      if (formState.category === "rings") {
        variantAttributes = variantAttributes.filter((a) => !/size/i.test(a.name));
        if (formState.sizingType === "adjustable") {
          variantAttributes.push({
            name: "Ring Size",
            options: ["Adjustable / Free Size"],
            sizeStock: { "Adjustable / Free Size": finalStockCount },
          });
        } else {
          const enabledSizes =
            formState.selectedSizes.length > 0 ? formState.selectedSizes : [...RING_SPECIFIC_SIZES];
          const activeSizeStock: Record<string, number> = {};
          let totalStockSum = 0;
          enabledSizes.forEach((s) => {
            const count = Math.max(0, formState.sizeStock[s] ?? 0);
            activeSizeStock[s] = count;
            totalStockSum += count;
          });
          finalStockCount = totalStockSum;
          variantAttributes.push({
            name: "Ring Size",
            options: enabledSizes,
            sizeStock: activeSizeStock,
          });
        }
      } else if (formState.category === "bangles-kada") {
        variantAttributes = variantAttributes.filter((a) => !/size/i.test(a.name));
        if (formState.sizingType === "adjustable") {
          variantAttributes.push({
            name: "Bangle Size",
            options: ["Adjustable / Openable Cuff"],
            sizeStock: { "Adjustable / Openable Cuff": finalStockCount },
          });
        } else {
          const enabledSizes =
            formState.selectedSizes.length > 0 ? formState.selectedSizes : [...BANGLE_SPECIFIC_SIZES];
          const activeSizeStock: Record<string, number> = {};
          let totalStockSum = 0;
          enabledSizes.forEach((s) => {
            const count = Math.max(0, formState.sizeStock[s] ?? 0);
            activeSizeStock[s] = count;
            totalStockSum += count;
          });
          finalStockCount = totalStockSum;
          variantAttributes.push({
            name: "Bangle Size",
            options: enabledSizes,
            sizeStock: activeSizeStock,
          });
        }
      }

      if (editingProduct) {
        // Update existing product in DB and Store
        await updateProduct(editingProduct.id, {
          title: formState.title,
          category: formState.category,
          price: parsedPriceInr,
          salePrice: parsedSalePriceInr,
          priceQatar: parsedPriceQar,
          salePriceQatar: parsedSalePriceQar,
          stockCount: finalStockCount,
          inStock: finalStockCount > 0,
          shortDescription: formState.shortDescription || formState.title,
          description: formState.description || formState.title,
          images: [formState.imageUrl],
          featured: formState.featured,
          isBestSeller: formState.isBestSeller,
          isNewArrival: formState.isNewArrival,
          variantAttributes,
        });
      } else {
        // Create new product in DB and Store
        const generatedSlug =
          formState.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") +
          "-" +
          Date.now().toString(36);

        await addProduct({
          title: formState.title,
          slug: generatedSlug,
          category: formState.category,
          price: parsedPriceInr,
          salePrice: parsedSalePriceInr,
          priceQatar: parsedPriceQar,
          salePriceQatar: parsedSalePriceQar,
          stockCount: finalStockCount,
          inStock: finalStockCount > 0,
          shortDescription: formState.shortDescription || formState.title,
          description: formState.description || formState.title,
          images: [formState.imageUrl],
          tags: [formState.category, "New"],
          rating: 5,
          reviewCount: 0,
          featured: formState.featured,
          isBestSeller: formState.isBestSeller,
          isNewArrival: formState.isNewArrival,
          variantAttributes,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to save product: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const filteredInventory = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4 sm:p-6 text-[#1C1917] relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1C1917_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="w-full max-w-md bg-card border border-border/80 rounded-3xl p-8 sm:p-10 shadow-xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <span className="font-editorial text-3xl sm:text-4xl tracking-tight text-foreground font-normal">
              {storeConfig.brand.logo.text}
            </span>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8F7234] font-medium">
              Merchant Management Portal
            </p>
          </div>

          <div className="border-t border-border/60 pt-2 text-center">
            <h2 className="text-base font-bold text-foreground">Sign In to Dashboard</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Enter your boutique administrator credentials to access catalog and order operations.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Admin Username or Email</span>
                <span className="text-[10px] text-muted-foreground font-mono">admin@alnaya.in</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="admin@alnaya.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none transition-all"
                />
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Secret Password</span>
                <span className="text-[10px] text-muted-foreground font-mono">alnaya@2026</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-10 pr-10 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>← Return to Store</span>
            </Link>
            <span className="flex items-center gap-1 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-primary text-primary-foreground">
                Authorized Merchant Portal
              </span>
              <span className="text-xs text-muted-foreground">Product, Order & Store Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground mt-1">
              {storeConfig.brand.logo.text} Boutique Management
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={openAddModal}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:bg-primary/90 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 rounded-xl border border-destructive/30 bg-card text-destructive hover:bg-destructive/10 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Sign out of Admin Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex gap-2 border-b border-border overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "inventory"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog & Editing {hasLoaded ? `(${products.length})` : "(...)"}</span>
          </button>

          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "overview"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Store Performance KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "orders"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Fulfillment ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "config"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Store Settings & Regional Setup</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "reviews"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews & Videos ({reviewsList.length + videosList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("collections")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "collections"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Curated Collections Cards ({categoriesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reels")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "reels"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Instagram className="w-4 h-4 text-[#E1306C]" />
            <span>Follow The House (Reels) ({instagramVideosList.length})</span>
          </button>
        </div>

        {/* Tab: Product Catalog Management & Editing */}
        {activeTab === "inventory" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span>Product Catalog</span>
                  {hasLoaded ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {filteredInventory.length} Pieces
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground animate-pulse">
                      Syncing catalog...
                    </span>
                  )}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add, edit prices, update stock levels, or remove pieces from your live catalog.
                </p>
              </div>

              {/* Search filter in catalog */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-muted/40 border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {!hasLoaded && products.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-muted/10 rounded-2xl border border-dashed border-border p-8">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                <p className="text-xs font-bold text-foreground">Syncing Live Product Catalog...</p>
                <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                  Connecting to database and loading real-time catalog items.
                </p>
              </div>
            ) : filteredInventory.length === 0 ? (
              <div className="py-16 text-center space-y-2 bg-muted/10 rounded-2xl border border-dashed border-border p-8">
                <Package className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="text-xs font-bold text-foreground">No products found</p>
                <p className="text-[11px] text-muted-foreground">
                  {searchQuery
                    ? `No pieces match "${searchQuery}". Try a different search query.`
                    : "Your live catalog is currently empty. Click 'Add New Product' to get started."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 font-semibold">Product</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Stock</th>
                    <th className="pb-3 font-semibold">Tags</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredInventory.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/30">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-10 h-12 object-cover rounded-md border border-border"
                          />
                          <div>
                            <span className="font-bold text-foreground block">{product.title}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">/{product.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 capitalize text-muted-foreground">{product.category}</td>
                      <td className="py-3 font-semibold text-foreground">
                        <div className="flex flex-col text-xs leading-tight">
                          <span className="text-foreground">
                            🇮🇳 {formatPrice(product.salePrice || product.price, "INR")}
                            {product.salePrice && (
                              <span className="text-[10px] text-muted-foreground line-through ml-1">
                                {formatPrice(product.price, "INR")}
                              </span>
                            )}
                          </span>
                          <span className="text-emerald-700 font-medium text-[11px] mt-0.5">
                            🇶🇦 {formatPrice(product.salePriceQatar || product.priceQatar || Math.max(10, Math.round((product.salePrice || product.price) / 20)), "QAR")}
                            {product.salePriceQatar && (
                              <span className="text-[10px] text-muted-foreground line-through ml-1">
                                {formatPrice(product.priceQatar || Math.max(10, Math.round(product.price / 20)), "QAR")}
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                            product.stockCount < 10
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {product.stockCount} units
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1 flex-wrap">
                          {product.featured && (
                            <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="text-[10px] bg-accent/20 text-accent font-bold px-1.5 py-0.5 rounded">
                              Best Seller
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-md hover:bg-muted text-foreground flex items-center gap-1 font-semibold text-xs border border-border hover:border-primary transition-colors"
                            title="Edit Product Details"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        )}

        {/* Tab: Overview KPIs */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">
                  {formatPrice(totalRevenue)}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  +18.4% from previous month
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">{totalOrdersCount}</p>
                <p className="text-[11px] text-muted-foreground">Processed via WhatsApp & Online Orders</p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value (AOV)</span>
                  <TrendingUp className="w-4 h-4 text-accent" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">{formatPrice(aov)}</p>
                <p className="text-[11px] text-muted-foreground">Elevated by free shipping threshold</p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-bold uppercase tracking-wider">Total In Stock</span>
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-foreground">{totalStockUnits}</p>
                <p className="text-[11px] text-muted-foreground">Across {products.length} catalog items</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Order Fulfillment */}
        {activeTab === "orders" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Order Fulfillment Queue
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage incoming customer orders, review deliveries, and update processing statuses.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {orders.length} Total Orders
              </span>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs bg-muted/20 rounded-xl border border-border">
                  No orders found in fulfillment queue yet.
                </div>
              ) : (
                orders.map((order) => {
                  const customerName =
                    order.customer?.fullName ||
                    (order.customer as any)?.name ||
                    (order as any).customerName ||
                    "Valued Customer";
                  const customerEmail =
                    order.customer?.email ||
                    (order as any).customerEmail ||
                    "Direct WhatsApp";
                  const customerPhone =
                    order.customer?.phone ||
                    (order as any).customerPhone ||
                    "";
                  const streetAddress =
                    order.customer?.address?.street ||
                    (order.customer as any)?.shippingAddress?.line1 ||
                    (order as any).shippingAddress ||
                    "Direct delivery";
                  const cityAddress =
                    order.customer?.address?.city ||
                    (order.customer as any)?.shippingAddress?.city ||
                    "";

                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm font-black text-foreground">
                            {order.orderNumber || order.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-primary/10 text-primary">
                            {order.paymentMethod || "WhatsApp Order"}
                          </span>
                        </div>
                        <p className="text-xs text-foreground font-medium">
                          {customerName} • {customerEmail} {customerPhone ? `• ${customerPhone}` : ""}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {streetAddress}
                          {cityAddress ? `, ${cityAddress}` : ""}
                        </p>
                        {order.items && order.items.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {order.items.map((item: any, i: number) => (
                              <span
                                key={i}
                                className="text-[10px] bg-background border border-border px-2 py-0.5 rounded text-foreground font-medium"
                              >
                                {item.quantity || 1}x {item.title || item.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
                        <div className="text-right sm:text-right">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Total</span>
                          <p className="text-sm font-black text-foreground">
                            {formatPrice(order.grandTotal || 0)}
                          </p>
                        </div>

                        <select
                          value={order.status || "processing"}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border border-border focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab: Store Settings & Regional Setup */}
        {activeTab === "config" && (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Storefront & Regional Operations
              </span>
              <h3 className="text-lg font-black text-foreground mt-1">
                Active Storefront Configuration
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Official contact details, multi-currency regional pricing, and shipping policies active across your boutique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Profile & Concierge */}
              <div className="p-5 rounded-xl bg-muted/30 border border-border space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>Store Contact & Concierge</span>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <p>Brand Name: <strong className="text-foreground">{storeConfig.brand.logo.text}</strong></p>
                  <p>Customer Support Email: <strong className="text-foreground">{storeConfig.brand.contact.email}</strong></p>
                  <p>WhatsApp Hotline: <strong className="text-foreground">+{storeConfig.brand.contact.whatsappNumber}</strong></p>
                  <p>Operating Hours: <strong className="text-foreground">{storeConfig.brand.contact.hours}</strong></p>
                  <p>Dispatch Atelier: <strong className="text-foreground">{storeConfig.brand.contact.address}</strong></p>
                </div>
              </div>

              {/* Regional Pricing & Delivery */}
              <div className="p-5 rounded-xl bg-muted/30 border border-border space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Dual Regional Pricing & Delivery</span>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <p>
                    🇮🇳 India (INR ₹):{" "}
                    <strong className="text-foreground">
                      Free Shipping on orders above ₹{storeConfig.commerce.freeShippingThreshold} (Flat ₹{storeConfig.commerce.flatShippingFee} below)
                    </strong>
                  </p>
                  <p>
                    🇶🇦 Qatar (QAR):{" "}
                    <strong className="text-emerald-700 font-bold">
                      100% Complimentary Express Delivery on all orders
                    </strong>
                  </p>
                  <p>Ordering Method: <strong className="text-foreground">Instant WhatsApp Order Direct Checkout</strong></p>
                  <p>Payment Modes: <strong className="text-foreground">Direct UPI (GPay/PhonePe/Paytm), COD & Direct Bank Transfer</strong></p>
                </div>
              </div>

              {/* Official Social Media Channels */}
              <div className="p-5 rounded-xl bg-muted/30 border border-border space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>Official Social Channels</span>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <p>
                    Instagram:{" "}
                    <a
                      href={storeConfig.brand.socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-mono text-[11px]"
                    >
                      @alnaya.in ↗
                    </a>
                  </p>
                  <p>
                    Facebook:{" "}
                    <a
                      href={storeConfig.brand.socials.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-mono text-[11px]"
                    >
                      Alnaya Official Page ↗
                    </a>
                  </p>
                  <p>
                    WhatsApp Channel:{" "}
                    <a
                      href={`https://wa.me/${storeConfig.brand.contact.whatsappNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-mono text-[11px]"
                    >
                      +{storeConfig.brand.contact.whatsappNumber} ↗
                    </a>
                  </p>
                </div>
              </div>

              {/* Admin Portal Access Credentials */}
              <div className="p-5 rounded-xl bg-muted/30 border border-border space-y-3">
                <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Admin Access Credentials</span>
                </div>
                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <p>Portal URL: <strong className="text-foreground font-mono">/admin</strong></p>
                  <p>Username / Email: <strong className="text-foreground font-mono">admin@alnaya.in</strong> (or <span className="font-mono">admin</span>)</p>
                  <p>Default Password: <strong className="text-foreground font-mono">alnaya@2026</strong></p>
                  <p>Session Security: <strong className="text-emerald-700">Encrypted Local Storage Authentication</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Reviews & Videos */}
        {activeTab === "reviews" && (
          <div className="space-y-8">
            {/* Header banner */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Social Proof & Media Management
                </span>
                <h3 className="text-xl font-black text-foreground mt-1">
                  Client Proof, Instagram Reels & Customer Reviews
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                  Manage WhatsApp / DM customer feedback screenshots, Instagram &ldquo;Follow The House&rdquo; video reels, customer review quotes, and product styling videos.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => setIsScreenshotModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:bg-primary/90 shadow-md transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>+ Upload Screenshot</span>
                </button>
                <button
                  onClick={() => setIsInstaVideoModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>+ Add Instagram Video</span>
                </button>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Quote</span>
                </button>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Video className="w-3.5 h-3.5 text-primary" />
                  <span>Add Reel</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: Client Feedback Screenshots (WhatsApp / DM Proof) */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    <span>Client Feedback Screenshots ({feedbackScreenshotsList.length})</span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    WhatsApp & DM customer chat screenshots displayed in the storefront feedback proof gallery.
                  </p>
                </div>
                <button
                  onClick={() => setIsScreenshotModalOpen(true)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Screenshot</span>
                </button>
              </div>

              {feedbackScreenshotsList.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-border text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">No feedback screenshots uploaded yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Upload real WhatsApp messages, order unpacking confirmations, or Instagram DM reviews from your smartphone or PC.
                  </p>
                  <button
                    onClick={() => setIsScreenshotModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90"
                  >
                    Upload First Screenshot
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {feedbackScreenshotsList.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-border overflow-hidden bg-muted/20 flex flex-col justify-between group shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-[3/4] bg-stone-900 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.customerName || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span className="text-[10px] bg-black/70 backdrop-blur px-2 py-0.5 rounded-full font-semibold text-white">
                            {item.date || "Verified"}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                          <p className="text-xs font-bold text-white line-clamp-1">{item.customerName}</p>
                          <p className="text-[10px] text-white/80 line-clamp-1">{item.location}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-card border-t border-border flex flex-col justify-between flex-1 gap-2">
                        <div className="space-y-1">
                          {item.piece && (
                            <span className="inline-block px-2 py-0.5 rounded bg-primary/10 text-primary font-medium text-[10px] line-clamp-1">
                              {item.piece}
                            </span>
                          )}
                          {item.caption && (
                            <p className="text-[11px] text-muted-foreground italic line-clamp-2">
                              {item.caption}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified Buyer</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteScreenshot(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                            title="Delete Screenshot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 2: Follow The House (Instagram Video Reels) */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>Follow The House — Instagram Videos ({instagramVideosList.length})</span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Reels & video links displayed in the homepage &ldquo;Follow The House&rdquo; section with playable in-site modal.
                  </p>
                </div>
                <button
                  onClick={() => setIsInstaVideoModalOpen(true)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Instagram Video</span>
                </button>
              </div>

              {instagramVideosList.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-border text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-600 flex items-center justify-center mx-auto">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-foreground">No Instagram videos added yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Paste links to your Instagram reels or styling videos to feature them on the storefront.
                  </p>
                  <button
                    onClick={() => setIsInstaVideoModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90"
                  >
                    Add First Instagram Video
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {instagramVideosList.map((video) => (
                    <div
                      key={video.id}
                      className="rounded-xl border border-border overflow-hidden bg-muted/20 flex flex-col justify-between group shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="relative aspect-[9/14] bg-stone-900 overflow-hidden">
                        <img
                          src={video.poster || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=700"}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 flex flex-col justify-between p-3 text-white">
                          <div className="flex items-center justify-end">
                            <span className="text-[10px] bg-pink-600/80 px-2 py-0.5 rounded-full font-medium">
                              Reel
                            </span>
                          </div>

                          <div className="self-center w-11 h-11 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>

                          <div>
                            <p className="text-xs font-bold line-clamp-1 text-white">{video.title}</p>
                            <p className="text-[10px] text-white/80">{video.handle || "@alnaya.in"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-card border-t border-border flex flex-col justify-between flex-1 gap-2">
                        {video.caption && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {video.caption}
                          </p>
                        )}

                        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                          <a
                            href={video.instagramLink || video.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                          >
                            <span>Open in Instagram</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteInstaVideo(video.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                            title="Delete Video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 3: Client Reviews (Quotes) Section */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>Customer Review Quotes ({reviewsList.length})</span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Written quotes displayed on the storefront testimonial carousel.
                  </p>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Add Review
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-xl border border-border bg-muted/20 flex flex-col justify-between space-y-4 relative group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <p className="text-xs text-foreground italic font-light leading-relaxed">
                        &ldquo;{rev.quote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-foreground">{rev.author}</span>
                        <span className="text-muted-foreground"> • {rev.location}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-medium text-[10px]">
                        {rev.piece}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: Styling Video Reels */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4 text-primary" />
                    <span>Tagged Styling Video Reels ({videosList.length})</span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Vertical video tests with tagged catalog pieces.
                  </p>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Add Video Reel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videosList.map((video) => (
                  <div
                    key={video.id}
                    className="rounded-xl border border-border overflow-hidden bg-muted/20 flex flex-col justify-between group shadow-sm"
                  >
                    <div className="relative aspect-[9/14] bg-black overflow-hidden">
                      <img
                        src={video.poster}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-3 text-white">
                        <div />

                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="self-center w-10 h-10 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </a>

                        <div>
                          <p className="text-xs font-bold line-clamp-1 text-white">{video.title}</p>
                          <p className="text-[10px] text-white/80">{video.handle}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-card border-t border-border flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-foreground block line-clamp-1">
                          {video.productTitle}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          ₹{video.productPrice}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                        title="Delete Video Reel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Curated Collections / Homepage Category Cards */}
        {activeTab === "collections" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="text-base font-bold text-foreground">
                    Curated Collections Cards ({categoriesList.length})
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage the category cards displayed on the Homepage &quot;Shop by Category&quot; section. Upload high-res jewelry photos, change titles, or edit category details.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Collection Card</span>
                </button>
              </div>
            </div>

            {/* Grid of Homepage Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {categoriesList.map((cat, index) => (
                <div
                  key={cat.id || cat.slug || index}
                  className="group relative rounded-xl border border-border/80 bg-background overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  {/* Card Visual Preview (matching homepage aspect-[4/5] ratio) */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                    {/* Order Index Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-white/90 border border-white/10">
                      Card #{index + 1}
                    </div>

                    {/* Quick Direct Upload Overlay / Button */}
                    <div className="absolute top-2.5 right-2.5">
                      <label
                        htmlFor={`cat-img-upload-${cat.id}`}
                        className={`px-2.5 py-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-[11px] font-medium backdrop-blur-sm border border-white/20 shadow-md cursor-pointer flex items-center gap-1.5 transition-all ${
                          updatingCatId === cat.id ? "opacity-50 pointer-events-none" : ""
                        }`}
                        title="Upload a new photo for this collection card"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Change Card Image</span>
                      </label>
                      <input
                        id={`cat-img-upload-${cat.id}`}
                        type="file"
                        accept="image/*"
                        disabled={updatingCatId === cat.id || isUploading}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleCategoryCardImageUpload(cat.id, f);
                          e.target.value = "";
                        }}
                        className="hidden"
                      />
                    </div>

                    {/* Uploading progress indicator */}
                    {updatingCatId === cat.id && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-10">
                        <Clock className="w-6 h-6 text-[#C5A059] animate-spin mb-2" />
                        <span className="text-xs font-bold text-white">Uploading &amp; Saving...</span>
                        <span className="text-[10px] text-white/70 mt-1">Updating cloud storage</span>
                      </div>
                    )}

                    {/* Text Preview Overlay matching storefront */}
                    <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                      <p className="text-[10px] uppercase tracking-widest text-[#EADBBE] font-medium">
                        Collection
                      </p>
                      <h4 className="text-sm font-bold leading-tight font-serif text-white drop-shadow">
                        {cat.name}
                      </h4>
                      {cat.description && (
                        <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Actions & Info Bar */}
                  <div className="p-3 bg-card border-t border-border flex items-center justify-between gap-2 mt-auto">
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-xs text-foreground block truncate">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono block truncate">
                        /{cat.slug}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditCategory(cat)}
                        className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit title & description"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/products?category=${cat.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="View collection on storefront"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/50 dark:hover:bg-red-950/40 transition-colors"
                        title="Remove collection card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Follow The House Video Reels */}
        {activeTab === "reels" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-[#E1306C]" />
                  <h3 className="text-base font-bold text-foreground">
                    Follow The House — Instagram Video Reels ({instagramVideosList.length})
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage the playable jewelry videos featured in the homepage &quot;FOLLOW THE HOUSE&quot; section. Upload MP4 video reels from your phone/PC, change thumbnails, or edit reel details.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <a
                  href="https://www.instagram.com/alnaya.in?psln=cDNzY3liNjltb203"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                  <span>@alnaya.in ↗</span>
                </a>
                <button
                  type="button"
                  onClick={handleOpenAddInstaVideo}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Upload New Reel</span>
                </button>
              </div>
            </div>

            {/* Grid of Follow The House Video Cards */}
            {instagramVideosList.length === 0 ? (
              <div className="p-12 rounded-xl border border-dashed border-border text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-pink-500/10 text-[#E1306C] flex items-center justify-center mx-auto">
                  <Instagram className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-foreground">No Video Reels Added Yet</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Upload MP4 styling videos, shower tests, or unboxing reels from your device to feature on the homepage.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddInstaVideo}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-sm"
                >
                  + Upload First Video Reel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {instagramVideosList.map((video, index) => {
                  const isDirectVideo =
                    video.videoUrl &&
                    (video.videoUrl.includes(".mp4") ||
                      video.videoUrl.includes(".webm") ||
                      video.videoUrl.includes("blob.vercel-storage.com") ||
                      video.videoUrl.startsWith("/uploads/") ||
                      video.videoUrl.startsWith("data:video") ||
                      video.videoUrl.includes("assets.mixkit.co"));

                  return (
                    <div
                      key={video.id || index}
                      className="group relative rounded-xl border border-border/80 bg-background overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                    >
                      {/* Reel Video Preview Container */}
                      <div className="relative aspect-[9/15] w-full overflow-hidden bg-stone-900">
                        {isDirectVideo ? (
                          <video
                            src={video.videoUrl}
                            poster={video.poster}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <img
                            src={
                              video.poster ||
                              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=700"
                            }
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-white/90 border border-white/10">
                            Reel #{index + 1}
                          </span>
                        </div>

                        {/* Direct 1-Click Upload Buttons */}
                        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
                          {/* 1-Click Change Video (MP4) */}
                          <label
                            htmlFor={`reel-vid-file-${video.id}`}
                            className={`px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-[11px] font-medium backdrop-blur-sm border border-white/20 shadow-md cursor-pointer flex items-center gap-1.5 transition-all ${
                              updatingInstaVideoId === String(video.id)
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                            title="Upload new video reel file (MP4/WebM) from your device"
                          >
                            <Upload className="w-3.5 h-3.5 text-pink-400" />
                            <span>Change Video</span>
                          </label>
                          <input
                            id={`reel-vid-file-${video.id}`}
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime,video/*"
                            disabled={updatingInstaVideoId === String(video.id) || isUploading}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleInstaCardVideoUpload(video.id, f);
                              e.target.value = "";
                            }}
                            className="hidden"
                          />

                          {/* 1-Click Change Cover / Thumbnail */}
                          <label
                            htmlFor={`reel-poster-file-${video.id}`}
                            className={`px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-[11px] font-medium backdrop-blur-sm border border-white/20 shadow-md cursor-pointer flex items-center gap-1.5 transition-all ${
                              updatingInstaVideoId === String(video.id)
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                            title="Upload new cover image from your device"
                          >
                            <Camera className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Change Cover</span>
                          </label>
                          <input
                            id={`reel-poster-file-${video.id}`}
                            type="file"
                            accept="image/*"
                            disabled={updatingInstaVideoId === String(video.id) || isUploading}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleInstaCardPosterUpload(video.id, f);
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </div>

                        {/* Uploading progress indicator */}
                        {updatingInstaVideoId === String(video.id) && (
                          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-10">
                            <Clock className="w-6 h-6 text-pink-400 animate-spin mb-2" />
                            <span className="text-xs font-bold text-white">Uploading &amp; Saving Reel...</span>
                            <span className="text-[10px] text-white/70 mt-1">Direct upload to Cloud CDN</span>
                          </div>
                        )}

                        {/* Bottom Text Details */}
                        <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none space-y-0.5">
                          <p className="text-[10px] text-[#F3DFB0] font-mono tracking-wider">
                            {video.handle ? video.handle.replace(/@?gleamnest\.in/gi, "@alnaya.in").replace(/gleamnest/gi, "alnaya") : "@alnaya.in"}
                          </p>
                          <h4 className="text-xs sm:text-sm font-bold leading-tight text-white drop-shadow line-clamp-1">
                            {video.title}
                          </h4>
                          {video.caption && (
                            <p className="text-[11px] text-white/80 line-clamp-1 font-light drop-shadow-sm">
                              {video.caption.replace(/gleamnest/gi, "alnaya").replace(/304\s*(&|and)\s*306/gi, "radiant finish")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Actions Footer */}
                      <div className="p-3 bg-card border-t border-border flex items-center justify-between gap-2 mt-auto">
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-xs text-foreground block truncate">
                            {video.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono block truncate">
                            {video.handle ? video.handle.replace(/@?gleamnest\.in/gi, "@alnaya.in").replace(/gleamnest/gi, "alnaya") : "@alnaya.in"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditInstaVideo(video)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit reel caption, title, or links"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={video.instagramLink || video.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="View video link / Instagram"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteInstaVideo(video.id)}
                            className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/50 dark:hover:bg-red-950/40 transition-colors"
                            title="Remove video reel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {editingProduct ? "Edit Product Details" : "Add New Product to Catalog"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {editingProduct ? `Updating SKU: ${editingProduct.id}` : "Publish a new piece to your storefront"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Product Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Four-Leaf Clover Pearl Necklace"
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Category *</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="necklaces-and-chains">Necklaces and Chains</option>
                    <option value="rings">Rings</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="bangles-kada">Bangles Kada</option>
                    <option value="watches">Watches</option>
                    <option value="charms">Charms</option>
                    <option value="hip-chains">Hip Chains</option>
                    <option value="anklets">Anklets</option>
                    <option value="kids-collection">Kids Collection</option>
                    <option value="new-arrivals">New Arrivals</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground">Inventory Units in Stock *</label>
                    {(formState.category === "rings" || formState.category === "bangles-kada") &&
                      formState.sizingType === "sizes" && (
                        <span className="text-[10px] text-primary font-bold">
                          Sum of size units
                        </span>
                      )}
                  </div>
                  <input
                    type="number"
                    required
                    readOnly={
                      (formState.category === "rings" || formState.category === "bangles-kada") &&
                      formState.sizingType === "sizes"
                    }
                    value={
                      (formState.category === "rings" || formState.category === "bangles-kada") &&
                      formState.sizingType === "sizes"
                        ? (formState.category === "rings" ? RING_SPECIFIC_SIZES : BANGLE_SPECIFIC_SIZES)
                            .filter((s) => formState.selectedSizes.includes(s))
                            .reduce((sum, s) => sum + Math.max(0, formState.sizeStock[s] ?? 0), 0)
                        : formState.stockCount
                    }
                    onChange={(e) => setFormState({ ...formState, stockCount: e.target.value })}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${
                      (formState.category === "rings" || formState.category === "bangles-kada") &&
                      formState.sizingType === "sizes"
                        ? "bg-muted/40 border-border text-foreground font-bold cursor-not-allowed"
                        : "bg-background border-border focus:ring-1 focus:ring-primary"
                    }`}
                  />
                </div>
              </div>

              {/* Sizing Option Configuration for Rings & Bangles */}
              {(formState.category === "rings" || formState.category === "bangles-kada") && (
                <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span>{formState.category === "rings" ? "Ring Sizing Setup" : "Bangle / Kada Sizing Setup"}</span>
                    </label>
                    <span className="text-[10px] text-muted-foreground font-medium">Customer Selection Mode</span>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    Choose whether this piece is adjustable (one size fits all) or offered in specific Indian sizes:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormState({ ...formState, sizingType: "adjustable" })}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        formState.sizingType === "adjustable"
                          ? "border-primary bg-background shadow-sm text-foreground ring-1 ring-primary"
                          : "border-border bg-card/60 text-muted-foreground hover:bg-background hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">✨ Adjustable / Free Size</span>
                        {formState.sizingType === "adjustable" && (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Selected</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                        {formState.category === "rings"
                          ? "One-size adjustable comfort band. No size dropdown shown to buyers."
                          : "One-size open flex-cuff. No size dropdown shown to buyers."}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormState({ ...formState, sizingType: "sizes" })}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        formState.sizingType === "sizes"
                          ? "border-primary bg-background shadow-sm text-foreground ring-1 ring-primary"
                          : "border-border bg-card/60 text-muted-foreground hover:bg-background hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">📏 Specific Sizes Only</span>
                        {formState.sizingType === "sizes" && (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Selected</span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                        {formState.category === "rings"
                          ? "Manage inventory per ring size (Sizes 10–20). Set 0 for out of stock sizes."
                          : "Manage inventory per bangle size (Sizes 2-2 to 2-10). Set 0 for out of stock sizes."}
                      </p>
                    </button>
                  </div>

                  {/* Specific Size Stock & Availability Management */}
                  {formState.sizingType === "sizes" && (
                    <div className="mt-3 p-3.5 rounded-xl border border-border bg-card shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-2.5">
                        <div>
                          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-primary" />
                            <span>Individual Size Inventory & Stock</span>
                          </h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Set stock for each size. Any size with 0 units will be marked Out of Stock.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-muted-foreground">Total:</span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {(formState.category === "rings" ? RING_SPECIFIC_SIZES : BANGLE_SPECIFIC_SIZES)
                              .filter((s) => formState.selectedSizes.includes(s))
                              .reduce((sum, s) => sum + Math.max(0, formState.sizeStock[s] ?? 0), 0)}{" "}
                            Units
                          </span>
                        </div>
                      </div>

                      {/* Quick Bulk Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            const allSizes = formState.category === "rings" ? RING_SPECIFIC_SIZES : BANGLE_SPECIFIC_SIZES;
                            setFormState((prev) => ({ ...prev, selectedSizes: [...allSizes] }));
                          }}
                          className="text-primary hover:underline font-semibold"
                        >
                          Select All
                        </button>
                        <span className="text-muted-foreground">•</span>
                        <button
                          type="button"
                          onClick={() => {
                            const allSizes = formState.category === "rings" ? RING_SPECIFIC_SIZES : BANGLE_SPECIFIC_SIZES;
                            const updatedStock = { ...formState.sizeStock };
                            allSizes.forEach((s) => {
                              if ((updatedStock[s] ?? 0) <= 0) updatedStock[s] = 1;
                            });
                            setFormState((prev) => ({
                              ...prev,
                              selectedSizes: [...allSizes],
                              sizeStock: updatedStock,
                            }));
                          }}
                          className="text-primary hover:underline font-semibold"
                        >
                          Set In-Stock (1 unit each)
                        </button>
                        <span className="text-muted-foreground">•</span>
                        <button
                          type="button"
                          onClick={() => {
                            const allSizes = formState.category === "rings" ? RING_SPECIFIC_SIZES : BANGLE_SPECIFIC_SIZES;
                            const updatedStock = { ...formState.sizeStock };
                            allSizes.forEach((s) => {
                              updatedStock[s] = 0;
                            });
                            setFormState((prev) => ({
                              ...prev,
                              sizeStock: updatedStock,
                            }));
                          }}
                          className="text-amber-600 hover:underline font-semibold"
                        >
                          Mark All Out of Stock
                        </button>
                      </div>

                      {/* Size List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {(formState.category === "rings" ? RING_SPECIFIC_SIZES : BANGLE_SPECIFIC_SIZES).map((sizeName) => {
                          const isEnabled = formState.selectedSizes.includes(sizeName);
                          const count = formState.sizeStock[sizeName] ?? 0;
                          const isSizeOut = count <= 0;

                          return (
                            <div
                              key={sizeName}
                              className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                                !isEnabled
                                  ? "border-border/40 bg-muted/20 opacity-60"
                                  : isSizeOut
                                  ? "border-amber-500/30 bg-amber-500/5 shadow-xs"
                                  : "border-border bg-background shadow-xs"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <input
                                  type="checkbox"
                                  id={`size-toggle-${sizeName}`}
                                  checked={isEnabled}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setFormState((prev) => {
                                      const nextSelected = checked
                                        ? [...prev.selectedSizes, sizeName]
                                        : prev.selectedSizes.filter((s) => s !== sizeName);
                                      return { ...prev, selectedSizes: nextSelected };
                                    });
                                  }}
                                  className="w-4 h-4 rounded text-primary focus:ring-primary/40 cursor-pointer"
                                />
                                <label
                                  htmlFor={`size-toggle-${sizeName}`}
                                  className="cursor-pointer select-none min-w-0"
                                >
                                  <div className="text-xs font-bold text-foreground truncate">
                                    {sizeName}
                                  </div>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    {!isEnabled ? (
                                      <span className="text-[10px] text-muted-foreground font-medium">Offered: No</span>
                                    ) : isSizeOut ? (
                                      <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                        Out of Stock
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                        In Stock ({count})
                                      </span>
                                    )}
                                  </div>
                                </label>
                              </div>

                              {/* Unit Input and Quick Toggles */}
                              {isEnabled && (
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <div className="flex flex-col items-end">
                                    <span className="text-[9px] text-muted-foreground font-medium">Stock</span>
                                    <input
                                      type="number"
                                      min="0"
                                      max="999"
                                      value={count}
                                      onChange={(e) => {
                                        const val = Math.max(0, parseInt(e.target.value) || 0);
                                        setFormState((prev) => ({
                                          ...prev,
                                          sizeStock: {
                                            ...prev.sizeStock,
                                            [sizeName]: val,
                                          },
                                        }));
                                      }}
                                      className={`w-14 px-1.5 py-1 text-xs text-center font-bold rounded-lg border outline-none ${
                                        isSizeOut
                                          ? "border-amber-400 bg-amber-50 text-amber-900"
                                          : "border-border bg-background text-foreground focus:border-primary"
                                      }`}
                                    />
                                  </div>

                                  {count > 0 ? (
                                    <button
                                      type="button"
                                      title="Mark size as Out of Stock"
                                      onClick={() => {
                                        setFormState((prev) => ({
                                          ...prev,
                                          sizeStock: { ...prev.sizeStock, [sizeName]: 0 },
                                        }));
                                      }}
                                      className="px-1.5 py-1 text-[10px] font-semibold text-muted-foreground hover:text-amber-600 rounded bg-muted/40 hover:bg-amber-50 transition-colors"
                                    >
                                      Set 0
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      title="Add 1 to stock"
                                      onClick={() => {
                                        setFormState((prev) => ({
                                          ...prev,
                                          sizeStock: { ...prev.sizeStock, [sizeName]: 1 },
                                        }));
                                      }}
                                      className="px-1.5 py-1 text-[10px] font-bold text-primary rounded bg-primary/10 hover:bg-primary/20 transition-colors"
                                    >
                                      +1
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Dual Country Pricing (India & Qatar) */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Product Pricing by Region</h4>
                    <p className="text-[10px] text-muted-foreground">Set separate retail and sale prices for India and Qatar</p>
                  </div>
                </div>

                {/* India (₹ INR) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <span>🇮🇳</span>
                    <span>India (₹ INR)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Price (₹) *</label>
                      <input
                        type="number"
                        step="1"
                        required
                        placeholder="899"
                        value={formState.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormState((prev) => ({
                            ...prev,
                            price: val,
                            // Auto-suggest Qatar price if empty
                            priceQatar: prev.priceQatar ? prev.priceQatar : val ? Math.max(10, Math.round(parseFloat(val) / 20)).toString() : "",
                          }));
                        }}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Sale Price (₹ Optional)</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="699"
                        value={formState.salePrice}
                        onChange={(e) => setFormState({ ...formState, salePrice: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Qatar (QAR) */}
                <div className="space-y-2 pt-3 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <span>🇶🇦</span>
                      <span>Qatar (QAR)</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Free Delivery in Qatar Included
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Price (QAR) *</label>
                      <input
                        type="number"
                        step="1"
                        required
                        placeholder="45"
                        value={formState.priceQatar}
                        onChange={(e) => setFormState({ ...formState, priceQatar: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-semibold text-emerald-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-muted-foreground">Sale Price (QAR Optional)</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="35"
                        value={formState.salePriceQatar}
                        onChange={(e) => setFormState({ ...formState, salePriceQatar: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Image (Upload from Device or Web URL) */}
              <div className="space-y-2 border border-border p-3.5 rounded-xl bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                    <span>Product Image *</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">Auto-compressed to fast web format</span>
                </div>

                {isUploading && (
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center gap-2 animate-pulse">
                    <Clock className="w-3.5 h-3.5 animate-spin shrink-0" />
                    <span>{uploadProgressText || "Optimizing and uploading photo..."}</span>
                  </div>
                )}

                {/* File picker */}
                <div>
                  <label
                    htmlFor="admin-file-upload"
                    className={`w-full px-3 py-2.5 rounded-lg border border-dashed border-border hover:border-primary bg-background hover:bg-muted/40 cursor-pointer flex items-center justify-center gap-2 text-xs font-medium text-foreground transition-colors ${
                      isUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4 text-primary" />
                    <span>Choose Photo from Device / Phone</span>
                  </label>
                  <input
                    id="admin-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Or paste public Image URL:</label>
                  <input
                    type="url"
                    placeholder="https://... or bucket link"
                    value={formState.imageUrl.startsWith("data:") ? "" : formState.imageUrl}
                    onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                  />
                </div>

                {/* Preview Thumbnail */}
                {formState.imageUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-16 h-20 rounded-md overflow-hidden border border-border bg-card">
                      <img src={formState.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-medium text-foreground">
                        {formState.imageUrl.startsWith("data:") ? "Photo Selected ✓" : "Web URL Linked ✓"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setFormState({ ...formState, imageUrl: "" })}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Short Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Waterproof • Hypoallergenic • Everyday Luxury"
                  value={formState.shortDescription}
                  onChange={(e) => setFormState({ ...formState, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Full Description & Story</label>
                <textarea
                  rows={3}
                  placeholder="Crafted with premium stainless steel in radiant gold finish. 100% waterproof, sweatproof, and hypoallergenic."
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-4 pt-2 border-t border-border">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.featured}
                    onChange={(e) => setFormState({ ...formState, featured: e.target.checked })}
                    className="accent-primary rounded"
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isBestSeller}
                    onChange={(e) => setFormState({ ...formState, isBestSeller: e.target.checked })}
                    className="accent-primary rounded"
                  />
                  <span>Mark Best Seller</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingProduct ? "Save Changes" : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Review Add Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsReviewModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Add Verified Client Review</h3>
                <p className="text-xs text-muted-foreground">
                  Publish customer feedback on the homepage testimonial reel
                </p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja Hegde"
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Kochi, Kerala"
                    value={reviewForm.location}
                    onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Purchased Jewelry Piece</label>
                <input
                  type="text"
                  placeholder="e.g. Statement Ring & Clover Bangle"
                  value={reviewForm.piece}
                  onChange={(e) => setReviewForm({ ...reviewForm, piece: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Customer Quote / Review *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write the customer's exact words..."
                  value={reviewForm.quote}
                  onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Reel Add Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isSavingItem && !isUploading && setIsVideoModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Add Styling Video Reel</h3>
                <p className="text-xs text-muted-foreground">
                  Upload a video from your device or paste a video link with tagged piece
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                disabled={isSavingItem || isUploading}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {isUploading && (
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center gap-2 animate-pulse">
                  <Clock className="w-4 h-4 animate-spin shrink-0" />
                  <span>{uploadProgressText || "Uploading file to server..."}</span>
                </div>
              )}

              {/* Video Source: Upload or URL */}
              <div className="space-y-2 border border-border p-3.5 rounded-xl bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-primary" />
                    <span>Video File / URL *</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">Device video or web link</span>
                </div>

                <div>
                  <label
                    htmlFor="video-reel-file-upload"
                    className={`w-full px-3 py-2.5 rounded-lg border border-dashed border-border hover:border-primary bg-background hover:bg-muted/40 cursor-pointer flex items-center justify-center gap-2 text-xs font-medium text-foreground transition-colors ${
                      isUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4 text-primary" />
                    <span>Choose Video from Device / Phone (MP4, WebM)</span>
                  </label>
                  <input
                    id="video-reel-file-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                    disabled={isUploading || isSavingItem}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Or paste direct Video URL:</label>
                  <input
                    type="text"
                    placeholder="https://...mp4 or /uploads/videos/..."
                    value={videoForm.videoUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                  />
                </div>

                {videoForm.videoUrl && (
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-border/60">
                    <span className="text-emerald-600 font-semibold truncate max-w-[280px]">
                      ✓ Video Attached ({videoForm.videoUrl.slice(-25)})
                    </span>
                    <button
                      type="button"
                      onClick={() => setVideoForm({ ...videoForm, videoUrl: "" })}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Poster / Thumbnail Upload or URL */}
              <div className="space-y-2 border border-border p-3.5 rounded-xl bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-primary" />
                    <span>Thumbnail Image (Optional)</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">Poster cover image</span>
                </div>

                <div>
                  <label
                    htmlFor="video-poster-file-upload"
                    className={`w-full px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary bg-background hover:bg-muted/40 cursor-pointer flex items-center justify-center gap-2 text-xs font-medium text-foreground transition-colors ${
                      isUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Upload Thumbnail from Device</span>
                  </label>
                  <input
                    id="video-poster-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleVideoPosterUpload}
                    className="hidden"
                    disabled={isUploading || isSavingItem}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Or paste thumbnail image URL: https://..."
                  value={videoForm.poster}
                  onChange={(e) => setVideoForm({ ...videoForm, poster: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                />

                {videoForm.poster && (
                  <div className="pt-1 flex items-center gap-2">
                    <img src={videoForm.poster} alt="Poster preview" className="w-12 h-14 object-cover rounded border border-border" />
                    <button
                      type="button"
                      onClick={() => setVideoForm({ ...videoForm, poster: "" })}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      Remove Thumbnail
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Video Title / Caption *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100% Waterproof Shower Test 💧"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Creator Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ananya Sanil"
                    value={videoForm.influencer}
                    onChange={(e) => setVideoForm({ ...videoForm, influencer: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Social Handle</label>
                  <input
                    type="text"
                    placeholder="e.g. @ananya.styling"
                    value={videoForm.handle}
                    onChange={(e) => setVideoForm({ ...videoForm, handle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-semibold text-foreground">Tagged Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Clover Bracelet - Gold"
                    value={videoForm.productTitle}
                    onChange={(e) => setVideoForm({ ...videoForm, productTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="150"
                    value={videoForm.productPrice}
                    onChange={(e) => setVideoForm({ ...videoForm, productPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Product Slug</label>
                <input
                  type="text"
                  placeholder="clover-bracelet-gold"
                  value={videoForm.productSlug}
                  onChange={(e) => setVideoForm({ ...videoForm, productSlug: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  disabled={isSavingItem || isUploading}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingItem || isUploading}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingItem && <Clock className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSavingItem ? "Saving..." : "Save Video Reel"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Feedback Screenshot Upload Modal */}
      {isScreenshotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isSavingItem && !isUploading && setIsScreenshotModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Upload Feedback Screenshot</h3>
                <p className="text-xs text-muted-foreground">
                  Upload WhatsApp message, Instagram DM proof, or unpacking photo
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScreenshotModalOpen(false)}
                disabled={isSavingItem || isUploading}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddScreenshot} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {isUploading && (
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center gap-2 animate-pulse">
                  <Clock className="w-4 h-4 animate-spin shrink-0" />
                  <span>{uploadProgressText || "Uploading screenshot to server..."}</span>
                </div>
              )}

              {/* File upload from Device or URL */}
              <div className="space-y-2 border border-border p-3.5 rounded-xl bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-primary" />
                    <span>Screenshot Image *</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">Device photo or URL</span>
                </div>

                {/* File picker */}
                <div>
                  <label
                    htmlFor="feedback-screenshot-upload"
                    className={`w-full px-3 py-2.5 rounded-lg border border-dashed border-border hover:border-primary bg-background hover:bg-muted/40 cursor-pointer flex items-center justify-center gap-2 text-xs font-medium text-foreground transition-colors ${
                      isUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4 text-primary" />
                    <span>Choose Screenshot from Device / Phone</span>
                  </label>
                  <input
                    id="feedback-screenshot-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotFileUpload}
                    className="hidden"
                    disabled={isUploading || isSavingItem}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Or paste public Image URL:</label>
                  <input
                    type="text"
                    placeholder="https://... or /uploads/screenshots/..."
                    value={screenshotForm.imageUrl}
                    onChange={(e) => setScreenshotForm({ ...screenshotForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                  />
                </div>

                {/* Preview Thumbnail */}
                {screenshotForm.imageUrl && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-16 h-20 rounded-md overflow-hidden border border-border bg-card">
                      <img src={screenshotForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs space-y-1">
                      <p className="font-medium text-emerald-600">Screenshot Ready ✓</p>
                      <button
                        type="button"
                        onClick={() => setScreenshotForm({ ...screenshotForm, imageUrl: "" })}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Customer Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave blank for Anonymous"
                    value={screenshotForm.customerName}
                    onChange={(e) => setScreenshotForm({ ...screenshotForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Calicut, Kerala"
                    value={screenshotForm.location}
                    onChange={(e) => setScreenshotForm({ ...screenshotForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Jewelry Piece Purchased</label>
                  <input
                    type="text"
                    placeholder="e.g. Clover Bangle (Size 2-6)"
                    value={screenshotForm.piece}
                    onChange={(e) => setScreenshotForm({ ...screenshotForm, piece: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Verification Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Verified 2 days ago"
                    value={screenshotForm.date}
                    onChange={(e) => setScreenshotForm({ ...screenshotForm, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Customer Message / Note</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Arrived in 2 days via DTDC. The mirror finish is so luxurious!"
                  value={screenshotForm.caption}
                  onChange={(e) => setScreenshotForm({ ...screenshotForm, caption: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsScreenshotModalOpen(false)}
                  disabled={isSavingItem || isUploading}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingItem || isUploading}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingItem && <Clock className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSavingItem ? "Publishing..." : "Publish Screenshot"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instagram Video ("Follow The House") Modal */}
      {isInstaVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isSavingItem && !isUploading && setIsInstaVideoModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {editingInstaVideo ? "Edit Follow The House Reel" : "Add Follow The House Reel"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {editingInstaVideo
                    ? "Update video file, cover thumbnail, caption, or Instagram link"
                    : "Upload styling reel (MP4) from device OR paste Instagram reel link"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInstaVideoModalOpen(false)}
                disabled={isSavingItem || isUploading}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInstaVideo} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {isUploading && (
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center gap-2 animate-pulse">
                  <Clock className="w-4 h-4 animate-spin shrink-0" />
                  <span>{uploadProgressText || "Uploading video to server..."}</span>
                </div>
              )}

              {/* Instagram Video Link OR Upload Video */}
              <div className="space-y-2 border border-border p-3.5 rounded-xl bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram Reel Link or Upload Video *</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">Reel URL or MP4</span>
                </div>

                {/* Upload Reel Video from device */}
                <div>
                  <label
                    htmlFor="insta-video-file-upload"
                    className={`w-full px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary bg-background hover:bg-muted/40 cursor-pointer flex items-center justify-center gap-2 text-xs font-medium text-foreground transition-colors ${
                      isUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Upload Video File from Device / Phone (MP4)</span>
                  </label>
                  <input
                    id="insta-video-file-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleInstaVideoFileUpload}
                    className="hidden"
                    disabled={isUploading || isSavingItem}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground">Or paste Instagram Reel link / Video URL:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. instagram.com/reel/C-xyz... or https://..."
                    value={instaVideoForm.videoUrl}
                    onChange={(e) => setInstaVideoForm({ ...instaVideoForm, videoUrl: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                  />
                </div>

                {instaVideoForm.videoUrl && (
                  <div className="pt-2 space-y-2 border-t border-border/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-semibold truncate max-w-[280px]">
                        ✓ Video Attached ({instaVideoForm.videoUrl.slice(-30)})
                      </span>
                      <button
                        type="button"
                        onClick={() => setInstaVideoForm({ ...instaVideoForm, videoUrl: "" })}
                        className="text-[11px] text-red-600 hover:underline"
                      >
                        Remove Video
                      </button>
                    </div>
                    {instaVideoForm.videoUrl.startsWith("http") && !instaVideoForm.videoUrl.includes("instagram.com/reel") && (
                      <div className="w-28 aspect-[9/14] rounded-lg overflow-hidden border border-border bg-black">
                        <video
                          src={instaVideoForm.videoUrl}
                          controls
                          muted
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Poster Thumbnail Upload or URL */}
              <div className="space-y-2 border border-border p-3.5 rounded-xl bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-primary" />
                    <span>Poster Thumbnail Image (Optional)</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">Preview image</span>
                </div>

                <div>
                  <label
                    htmlFor="insta-poster-file-upload"
                    className={`w-full px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary bg-background hover:bg-muted/40 cursor-pointer flex items-center justify-center gap-2 text-xs font-medium text-foreground transition-colors ${
                      isUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Upload Thumbnail from Device</span>
                  </label>
                  <input
                    id="insta-poster-file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleInstaPosterUpload}
                    className="hidden"
                    disabled={isUploading || isSavingItem}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Or paste thumbnail image URL: https://..."
                  value={instaVideoForm.poster}
                  onChange={(e) => setInstaVideoForm({ ...instaVideoForm, poster: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                />

                {instaVideoForm.poster && (
                  <div className="pt-1 flex items-center gap-2">
                    <img src={instaVideoForm.poster} alt="Poster preview" className="w-12 h-14 object-cover rounded border border-border" />
                    <button
                      type="button"
                      onClick={() => setInstaVideoForm({ ...instaVideoForm, poster: "" })}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      Remove Thumbnail
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Reel Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daily Jewelry Stack & Styling Glow"
                    value={instaVideoForm.title}
                    onChange={(e) => setInstaVideoForm({ ...instaVideoForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Instagram Handle</label>
                  <input
                    type="text"
                    placeholder="@alnaya.in"
                    value={instaVideoForm.handle}
                    onChange={(e) => setInstaVideoForm({ ...instaVideoForm, handle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Instagram Profile / Reel Link</label>
                <input
                  type="text"
                  placeholder="https://www.instagram.com/reel/..."
                  value={instaVideoForm.instagramLink}
                  onChange={(e) => setInstaVideoForm({ ...instaVideoForm, instagramLink: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Caption / Description</label>
                <textarea
                  rows={2}
                  placeholder="Waterproof everyday luxury crafted with radiant finish ✨"
                  value={instaVideoForm.caption}
                  onChange={(e) => setInstaVideoForm({ ...instaVideoForm, caption: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInstaVideoModalOpen(false)}
                  disabled={isSavingItem || isUploading}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingItem || isUploading}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingItem && <Clock className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSavingItem ? "Saving..." : editingInstaVideo ? "Update Video Reel" : "Save Video Reel"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Card Add / Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCategoryModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {editingCategory ? "Edit Curated Collection Card" : "Add New Collection Card"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Customize the title, photo, and URL slug shown on the homepage grid.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryModal} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Collection Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Necklaces & Chains"
                  value={categoryForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setCategoryForm((prev) => ({
                      ...prev,
                      name,
                      slug: !editingCategory
                        ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
                        : prev.slug,
                    }));
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Category Slug (URL Path) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. necklaces-and-chains"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Subtitle / Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Waterproof everyday pendants & chains"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* Card Image Upload & URL */}
              <div className="space-y-2 border border-border p-3.5 rounded-xl bg-muted/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-primary" />
                    <span>Card Photo *</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">Auto-compressed to fast web format</span>
                </div>

                {isUploading && (
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center gap-2 animate-pulse">
                    <Clock className="w-3.5 h-3.5 animate-spin shrink-0" />
                    <span>{uploadProgressText || "Optimizing and uploading photo..."}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="category-card-modal-upload"
                    className={`w-full px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary bg-background hover:bg-muted/40 cursor-pointer flex items-center justify-center gap-2 text-xs font-medium text-foreground transition-colors ${
                      isUploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Upload Image from Device</span>
                  </label>
                  <input
                    id="category-card-modal-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleCategoryModalImageUpload}
                    className="hidden"
                    disabled={isUploading || isSavingItem}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Or paste image URL: https://..."
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                />

                {categoryForm.image && (
                  <div className="pt-2 flex items-center gap-3">
                    <div className="w-16 h-20 rounded-lg overflow-hidden border border-border bg-card">
                      <img
                        src={categoryForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">Card Photo Attached ✓</p>
                      <button
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, image: "" })}
                        className="text-[11px] text-red-600 hover:underline mt-1 block"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  disabled={isSavingItem || isUploading}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingItem || isUploading || !categoryForm.name}
                  className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingItem && <Clock className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSavingItem ? "Saving..." : editingCategory ? "Update Card" : "Add Card"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Real-Time Media Processing & Upload Status Floating Banner */}
      {isUploading && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 px-4 py-3 bg-neutral-900/95 text-white rounded-2xl shadow-2xl border border-[#C5A059]/50 backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-3">
          <div className="relative w-5 h-5 shrink-0">
            <div className="w-5 h-5 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#F7EEDD] flex items-center gap-1.5">
              <span>Optimizing Media</span>
            </p>
            <p className="text-[11px] text-stone-300 font-mono mt-0.5 max-w-[320px] truncate">
              {uploadProgressText || "Compressing to lightweight web format..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
