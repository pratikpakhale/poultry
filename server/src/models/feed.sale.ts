import { Schema, model } from "mongoose";
import material from "./material";

const feedSaleSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    material: {
      type: Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
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

feedSaleSchema.index({ date: 1 });

feedSaleSchema.post("save", async function (doc, next) {
  await material.updateOne(
    { _id: doc.material },
    { $inc: { quantity: -doc.quantity } }
  );
  next();
});

feedSaleSchema.post("findOneAndUpdate", async function (doc, next) {
  if (doc?.deleted) {
    await material.updateOne(
      { _id: doc.material },
      { $inc: { quantity: doc.quantity } }
    );
  }
  next();
});

export default model("FeedSale", feedSaleSchema);
