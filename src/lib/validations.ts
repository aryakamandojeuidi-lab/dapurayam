import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi").max(200),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  shortDescription: z.string().optional().nullable(),
  price: z.number().nonnegative().optional().nullable(),
  packageSize: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  ingredients: z.string().optional().nullable(),
  storageInstructions: z.string().optional().nullable(),
  servingSuggestion: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  featuredOrder: z.number().int().default(0),
  relatedArticleIds: z.array(z.string()).optional(),
  shopeeUrl: z.string().optional().nullable(),
  tokopediaUrl: z.string().optional().nullable(),
  websiteOrderEnabled: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(200),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  description: z.string().optional().nullable(),
});

export const articleSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(300),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(300)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, "Konten wajib diisi"),
  coverImageUrl: z.string().optional().nullable(),
  authorName: z.string().min(1, "Penulis wajib diisi").max(200),
  categoryId: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).default("DRAFT"),
  isFeatured: z.boolean(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  publishedAt: z.date().optional().nullable(),
});

export const articleCategorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(200),
  slug: z
    .string()
    .min(1, "Slug wajib diisi")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  description: z.string().optional().nullable(),
});

export const siteSettingsSchema = z.object({
  businessName: z.string().min(1, "Nama bisnis wajib diisi").max(200),
  tagline: z.string().max(300).optional().nullable(),
  description: z.string().optional().nullable(),
  whatsappNumber: z.string().optional().nullable(),
  contactEmail: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  operationalHours: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  tiktokUrl: z.string().optional().nullable(),
  footerText: z.string().optional().nullable(),
  heroHeadline: z.string().optional().nullable(),
  heroSubtext: z.string().optional().nullable(),
  shopeeStoreUrl: z.string().optional().nullable(),
  tokopediaStoreUrl: z.string().optional().nullable(),
  positioningLabel: z.string().optional().nullable(),
  freshnessNote: z.string().optional().nullable(),
});

// === ORDER ===
export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
]);

export const orderChannelSchema = z.enum([
  "WEBSITE",
  "SHOPEE",
  "WHATSAPP",
  "TOKOPEDIA",
]);

export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Nama pelanggan minimal 2 karakter").max(200),
  customerPhone: z
    .string()
    .min(6, "Nomor telepon minimal 6 digit")
    .max(30, "Nomor telepon terlalu panjang")
    .regex(/^[0-9+\-\s]+$/, "Nomor telepon hanya boleh angka, spasi, +, dan -"),
  customerEmail: z.string().email("Format email tidak valid").optional().nullable(),
  customerAddress: z.string().max(1000).optional().nullable(),
  customerNote: z.string().max(2000).optional().nullable(),
  channel: orderChannelSchema.default("WEBSITE"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        productName: z.string().min(1),
        productSlug: z.string().optional().nullable(),
        productImageUrl: z.string().optional().nullable(),
        unitPrice: z.number().nonnegative().default(0),
        quantity: z.number().int().positive().default(1),
      }),
    )
    .min(1, "Pesanan harus berisi minimal 1 produk"),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
  adminNote: z.string().optional().nullable(),
});

export type ProductValues = z.infer<typeof productSchema>;
export type CategoryValues = z.infer<typeof categorySchema>;
export type ArticleValues = z.infer<typeof articleSchema>;
export type ArticleCategoryValues = z.infer<typeof articleCategorySchema>;
export type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;
export type CreateOrderValues = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusValues = z.infer<typeof updateOrderStatusSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderChannel = z.infer<typeof orderChannelSchema>;
