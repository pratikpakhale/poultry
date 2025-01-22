import { Schema, model } from "mongoose";

const formulaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    materials: [
      {
        material: {
          type: Schema.Types.ObjectId,
          ref: "Material",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Formula", formulaSchema);
