import { Schema, model } from "mongoose";
import flock from "./flock";

const birdSaleSchema = new Schema(
  {
    flock: {
      type: Schema.Types.ObjectId,
      ref: "Flock",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    rate: {
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

birdSaleSchema.post("save", async function (doc, next) {
  await flock.updateOne(
    { _id: doc.flock },
    { $inc: { quantity: -doc.quantity } }
  );
  next();
});

birdSaleSchema.post("findOneAndUpdate", async function (doc, next) {
  if (doc?.deleted) {
    await flock.updateOne(
      { _id: doc.flock },
      { $inc: { quantity: doc.quantity } }
    );
  }
  next();
});

export default model("BirdSale", birdSaleSchema);
