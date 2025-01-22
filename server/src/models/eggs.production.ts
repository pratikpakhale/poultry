import { Schema, model } from "mongoose";
import flock from "./flock";

const eggsProductionSchema = new Schema(
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
    type: {
      type: String,
      required: true,
      enum: ["normal", "cracked"],
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

eggsProductionSchema.post("save", async function (doc, next) {
  await flock.updateOne({ _id: doc.flock }, { $inc: { eggs: doc.quantity } });
  next();
});

eggsProductionSchema.post("findOneAndUpdate", async function (doc, next) {
  if (doc?.deleted) {
    await flock.updateOne(
      { _id: doc.flock },
      { $inc: { eggs: -doc.quantity } }
    );
  }
  next();
});

export default model("EggsProduction", eggsProductionSchema);
