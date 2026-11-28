import { Product } from "@/types/store";

export function normalizeCategorySlug(s: string): string {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-");
}

export const isRingCategory = (cat: string) => cat === "rings" || cat === "ring";
export const isBangleCategory = (cat: string) =>
  cat === "bangles-kada" || cat === "bangles" || cat === "bangle" || cat === "kada" || cat === "kadas";

export function matchesCategory(p: Product, catSlug: string): boolean {
  if (!catSlug || catSlug === "all") return true;
  if (catSlug === "new-arrivals") return !!p.isNewArrival || p.category === "new-arrivals";
  if (catSlug === "minimal-chains") {
    return p.category === "minimal-chains" || p.tags.some((t) => /minimal/i.test(t)) || /chain|pendant/i.test(p.title);
  }
  if (catSlug === "hanging-chains") {
    return p.category === "hanging-chains" || p.tags.some((t) => /hanging/i.test(t)) || /hanging|lariat|drop/i.test(p.title);
  }
  if (catSlug === "necklaces-and-chains" || catSlug === "necklaces") {
    return p.category === "necklaces-and-chains" || p.category === "necklaces" || /necklace|chain|pendant/i.test(p.title);
  }
  if (catSlug === "jhumkas") {
    return p.category === "jhumkas" || /jhumka|jhumki|temple/i.test(p.title);
  }
  if (catSlug === "stud-and-hoops") {
    return p.category === "stud-and-hoops" || /stud|hoop|huggie/i.test(p.title);
  }
  if (catSlug === "traditional-earrings") {
    return p.category === "traditional-earrings" || /chandbali|traditional|earring/i.test(p.title);
  }
  if (catSlug === "traditional-sets") {
    return p.category === "traditional-sets" || /set|bridal|necklace set/i.test(p.title);
  }
  if (catSlug === "offer-products") {
    return p.category === "offer-products" || p.tags.some((t) => /offer/i.test(t)) || !!p.salePrice || !!p.isBestSeller;
  }
  if (catSlug === "bangles-kada" || catSlug === "bangles") {
    return p.category === "bangles-kada" || p.category === "bangles" || /bangle|kada|cuff|chooda/i.test(p.title);
  }
  if (catSlug === "bracelets" || catSlug === "bracelet") {
    return p.category === "bracelets" || p.category === "bracelet" || /bracelet/i.test(p.title);
  }
  if (catSlug === "rings" || catSlug === "ring") {
    return p.category === "rings" || p.category === "ring" || /ring|band/i.test(p.title);
  }
  if (catSlug === "anklets") {
    return p.category === "anklets" || /anklet|payal/i.test(p.title);
  }
  if (catSlug === "nosepin") {
    return p.category === "nosepin" || p.category === "charms" || /nosepin|nath|nose/i.test(p.title);
  }
  if (catSlug === "earrings" || catSlug === "earring") {
    return p.category === "earrings" || p.category === "earring" || /earring|stud|hoop/i.test(p.title);
  }
  return p.category === catSlug || normalizeCategorySlug(p.category) === normalizeCategorySlug(catSlug);
}
