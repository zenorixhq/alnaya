export interface SiteImagesConfig {
  // About Us Section
  aboutImage1: string;
  aboutImage2: string;

  // Hero Section
  heroDesktop: string;
  heroMobile: string;
  heroSignature: string;

  // Brand Identity
  brandLogo: string;

  // Guides & Policies
  bangleSizeGuide: string;
  returnPolicyImage: string;
}

export const defaultSiteImages: SiteImagesConfig = {
  aboutImage1: "/images/about-model-necklace.jpg",
  aboutImage2: "/images/about-model-cuff.jpg",
  heroDesktop: "/images/founder-aleena-saree-hero.jpg",
  heroMobile: "/images/founder-aleena-mobile.jpg",
  heroSignature: "/images/aleena-signature-dark.png",
  brandLogo: "/alnaya-logo.png",
  bangleSizeGuide: "/images/bangle-size-guide.jpg",
  returnPolicyImage: "/images/return-refund-policy.jpg",
};
