import { create } from "zustand";
import { Product } from "@/types/store";

const STORAGE_KEY = "alnaya_catalog_persistent_v8";
const STORAGE_TIME_KEY = "alnaya_catalog_time_v8";
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours persistent cache

// Auto-purge obsolete and legacy catalog cache keys from previous versions
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("alnaya_products_catalog");
    localStorage.removeItem("alnaya_products_catalog_v2");
    localStorage.removeItem("alnaya_products_catalog_v3");
    sessionStorage.removeItem("alnaya_products_catalog");
    sessionStorage.removeItem("alnaya_products_catalog_v2");
    sessionStorage.removeItem("alnaya_products_catalog_v3");
    sessionStorage.removeItem("alnaya_catalog_live_v5");
    sessionStorage.removeItem("alnaya_catalog_live_v6");
    sessionStorage.removeItem("alnaya_categories");
  } catch (e) {}
}

function getInitialProducts(): { products: Product[]; hasLoaded: boolean } {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { products: parsed, hasLoaded: true };
        }
      }
    } catch (e) {
      // Ignore if storage error
    }
  }
  return { products: [], hasLoaded: false };
}

function persistProducts(prods: Product[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prods));
      localStorage.setItem(STORAGE_TIME_KEY, String(Date.now()));
    } catch (e) {}
  }
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  fetchProducts: (force?: boolean) => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
}

const initial = getInitialProducts();

export const useProductStore = create<ProductStore>((set, get) => ({
  products: initial.products,
  isLoading: !initial.hasLoaded,
  hasLoaded: initial.hasLoaded,
  error: null,

  fetchProducts: async (force = false) => {
    // 1. If products are already in memory and cache is still fresh (< 2 hours), skip redundant network fetch completely
    if (get().hasLoaded && get().products.length > 0 && !force) {
      if (typeof window !== "undefined") {
        try {
          const cachedTime = parseInt(localStorage.getItem(STORAGE_TIME_KEY) || "0", 10);
          if (cachedTime > 0 && Date.now() - cachedTime < CACHE_TTL_MS) {
            return; // 100% cache hit: 0 bytes transferred
          }
        } catch (e) {}
      }
    }

    try {
      if (get().products.length === 0) {
        set({ isLoading: true });
      }
      const url = force ? `/api/products?t=${Date.now()}` : "/api/products";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        set({ products: sorted, hasLoaded: true, isLoading: false, error: null });
        persistProducts(sorted);
      } else {
        set({ hasLoaded: true, isLoading: false });
      }
    } catch (err: any) {
      console.error("fetchProducts error:", err);
      set({ error: err.message, isLoading: false, hasLoaded: true });
    }
  },

  addProduct: async (newProd) => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProd),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create product");
      }

      const createdProduct = await res.json();
      const updatedProducts = [createdProduct, ...get().products.filter((p) => p.id !== createdProduct.id)];
      set({ products: updatedProducts, isLoading: false });
      persistProducts(updatedProducts);

      return createdProduct;
    } catch (err: any) {
      console.error("addProduct error:", err);
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      set({ isLoading: true });
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update product");
      }

      const updated = await res.json();
      const updatedProducts = get().products.map((p) => (p.id === id ? { ...p, ...updated } : p));
      set({ products: updatedProducts, isLoading: false });
      persistProducts(updatedProducts);

      return updated;
    } catch (err: any) {
      console.error("updateProduct error:", err);
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ isLoading: true });
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete product");
      }

      const updatedProducts = get().products.filter((p) => p.id !== id);
      set({ products: updatedProducts, isLoading: false });
      persistProducts(updatedProducts);

      return true;
    } catch (err: any) {
      console.error("deleteProduct error:", err);
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  getProductById: (id) => get().products.find((p) => p.id === id),
  getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),
}));
