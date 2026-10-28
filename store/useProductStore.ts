import { create } from "zustand";
import { Product } from "@/types/store";
import { products as fallbackProducts } from "@/data/mockData";

function getInitialProducts(): Product[] {
  if (typeof window !== "undefined") {
    try {
      const cached = sessionStorage.getItem("alnaya_products_catalog");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // Ignore if sessionStorage error
    }
  }
  return fallbackProducts;
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  addProduct: (productData: any) => Promise<Product | null>;
  updateProduct: (id: string, updateData: any) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductBySlug: (slug: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: getInitialProducts(),
  isLoading: false,
  hasLoaded: true,
  error: null,

  fetchProducts: async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        set({ products: data, hasLoaded: true, isLoading: false });
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("alnaya_products_catalog", JSON.stringify(data));
          } catch (e) {}
        }
      } else {
        set({ hasLoaded: true, isLoading: false });
      }
    } catch (err: any) {
      console.error("fetchProducts error:", err);
      set({ error: err.message, isLoading: false });
    }
  },

  addProduct: async (productData: any) => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create product");
      }

      const createdProduct = await res.json();
      const updatedProducts = [createdProduct, ...get().products.filter((p) => p.id !== createdProduct.id)];
      set({ products: updatedProducts, isLoading: false });
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("alnaya_products_catalog", JSON.stringify(updatedProducts));
        } catch (e) {}
      }

      return createdProduct;
    } catch (err: any) {
      console.error("addProduct error:", err);
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  updateProduct: async (id: string, updateData: any) => {
    try {
      set({ isLoading: true });
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update product");
      }

      const updated = await res.json();
      const updatedProducts = get().products.map((p) => (p.id === id ? { ...p, ...updated } : p));
      set({ products: updatedProducts, isLoading: false });
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("alnaya_products_catalog", JSON.stringify(updatedProducts));
        } catch (e) {}
      }

      return updated;
    } catch (err: any) {
      console.error("updateProduct error:", err);
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      set({ isLoading: true });
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      const updatedProducts = get().products.filter((p) => p.id !== id);
      set({ products: updatedProducts, isLoading: false });
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("alnaya_products_catalog", JSON.stringify(updatedProducts));
        } catch (e) {}
      }

      return true;
    } catch (err: any) {
      console.error("deleteProduct error:", err);
      set({ error: err.message, isLoading: false });
      return false;
    }
  },

  getProductBySlug: (slug: string) => {
    return get().products.find((p) => p.slug === slug);
  },
}));
