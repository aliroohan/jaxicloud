import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const InquiryItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    bundleId: { type: Schema.Types.ObjectId, ref: "Bundle" },
    name: { type: String, required: true },
    slug: { type: String, default: "" },
    quantity: { type: Number, default: 1, min: 1 },
    type: { type: String, enum: ["product", "bundle"], default: "product" },
  },
  { _id: false },
);

const InquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    message: { type: String, default: "" },
    items: { type: [InquiryItemSchema], default: [] },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

export type InquiryDocument = InferSchemaType<typeof InquirySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Inquiry = models.Inquiry || model("Inquiry", InquirySchema);
