import { Schema, model } from "mongoose";
import material from "./material";

const feedPurchaseSchema = new Schema(
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

feedPurchaseSchema.index({ date: 1, material: 1 });

feedPurchaseSchema.post("save", async function (doc, next) {
  await material.updateOne(
    { _id: doc.material },
    { $inc: { quantity: doc.quantity } }
  );
  next();
});

feedPurchaseSchema.post("findOneAndUpdate", async function (doc, next) {
  if (doc?.deleted) {
    await material.updateOne(
      { _id: doc.material },
      { $inc: { quantity: -doc.quantity } }
    );
  }
  next();
});

export default model("FeedPurchase", feedPurchaseSchema);
