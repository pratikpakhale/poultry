import { Schema, model } from "mongoose";

const flockSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    eggs: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    mortality: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
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

export default model("Flock", flockSchema);
