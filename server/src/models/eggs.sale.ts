import { Schema, model } from "mongoose";
import flock from "./flock";

const eggsSales = new Schema(
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
    customer: {
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

eggsSales.post("save", async function (doc, next) {
  await flock.updateOne({ _id: doc.flock }, { $inc: { eggs: -doc.quantity } });
  next();
});

eggsSales.post("findOneAndUpdate", async function (doc, next) {
  if (doc?.deleted) {
    await flock.updateOne({ _id: doc.flock }, { $inc: { eggs: doc.quantity } });
  }
  next();
});

export default model("EggsSale", eggsSales);
