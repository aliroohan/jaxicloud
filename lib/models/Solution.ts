import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const SolutionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true },
);

export type SolutionDocument = InferSchemaType<typeof SolutionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Solution = models.Solution || model("Solution", SolutionSchema);
