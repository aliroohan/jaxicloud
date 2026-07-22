import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false },
);

const BundleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    images: { type: [ImageSchema], default: [] },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    price: { type: String, default: "Contact for pricing" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true },
);

export type BundleDocument = InferSchemaType<typeof BundleSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Bundle = models.Bundle || model("Bundle", BundleSchema);
