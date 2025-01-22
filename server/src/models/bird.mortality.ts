import { Schema, model } from "mongoose";
import flock from "./flock";

const birdMortalitySchema = new Schema(
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
    cause: {
      type: String,
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

birdMortalitySchema.post("save", async function (doc, next) {
  await flock.updateOne(
    { _id: doc.flock },
    { $inc: { mortality: doc.quantity } }
  );
  next();
});

birdMortalitySchema.post("findOneAndUpdate", async function (doc, next) {
  if (doc?.deleted) {
    await flock.updateOne(
      { _id: doc.flock },
      { $inc: { mortality: -doc.quantity } }
    );
  }
  next();
});

export default model("BirdMortality", birdMortalitySchema);
