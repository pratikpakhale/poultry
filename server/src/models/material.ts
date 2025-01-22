import { Schema, model } from "mongoose";

const materialSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["medicine", "feed"],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Material", materialSchema);
