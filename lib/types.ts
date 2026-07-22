export type ImageAsset = { url: string; alt?: string };

export type KeyFeature = {
  icon?: string;
  title: string;
  description?: string;
};

export type SpecGroup = {
  groupName: string;
  items: { label: string; value: string }[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  modelNumber?: string;
  tagline?: string;
  overview: string;
  categoryId: string;
  category?: Category;
  images: ImageAsset[];
  tags: string[];
  keyFeatures: KeyFeature[];
  specifications: SpecGroup[];
  certifications: string[];
  videoUrls: string[];
  specSheetUrl?: string;
  supplierSource?: string;
  price?: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaDescription?: string;
  solutionIds: string[];
  solutions?: Solution[];
  bundles?: Bundle[];
  createdAt?: string;
  updatedAt?: string;
};

export type Bundle = {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: ImageAsset[];
  productIds: string[];
  products?: Product[];
  price?: string;
  status: "draft" | "published";
  metaTitle?: string;
  metaDescription?: string;
};

export type Solution = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productIds: string[];
  products?: Product[];
  metaTitle?: string;
  metaDescription?: string;
};

export type InquiryItem = {
  productId?: string;
  bundleId?: string;
  name: string;
  slug?: string;
  quantity: number;
  type: "product" | "bundle";
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  items: InquiryItem[];
  status: "new" | "contacted" | "closed";
  createdAt?: string;
  updatedAt?: string;
};
