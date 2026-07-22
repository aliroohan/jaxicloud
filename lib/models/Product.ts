import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false },
);

const KeyFeatureSchema = new Schema(
  {
    icon: { type: String, default: "" },
    title: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const SpecItemSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const SpecGroupSchema = new Schema(
  {
    groupName: { type: String, required: true },
    items: { type: [SpecItemSchema], default: [] },
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    modelNumber: { type: String, default: "" },
    tagline: { type: String, default: "" },
    overview: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: { type: [ImageSchema], default: [] },
    tags: { type: [String], default: [] },
    keyFeatures: { type: [KeyFeatureSchema], default: [] },
    specifications: { type: [SpecGroupSchema], default: [] },
    certifications: { type: [String], default: [] },
    videoUrls: { type: [String], default: [] },
    specSheetUrl: { type: String, default: "" },
    supplierSource: { type: String, default: "" },
    price: { type: String, default: "Contact for pricing" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    solutionIds: [{ type: Schema.Types.ObjectId, ref: "Solution" }],
  },
  { timestamps: true },
);

ProductSchema.index({ categoryId: 1, status: 1 });
ProductSchema.index({ tags: 1 });

export type ProductDocument = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product = models.Product || model("Product", ProductSchema);
