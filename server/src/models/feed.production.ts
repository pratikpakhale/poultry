import { Schema, model } from "mongoose";
import formula from "../models/formula";
import material from "./material";

const feedProductionSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    formula: {
      type: Schema.Types.ObjectId,
      ref: "Formula",
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

feedProductionSchema.index({ date: 1, formula: 1 });

feedProductionSchema.post("save", async function (doc, next) {
  const formulaDoc = await formula.findOne({ _id: doc.formula });
  if (!formulaDoc) return next();

  for (const m of formulaDoc.materials) {
    await material.updateOne(
      { _id: m.material },
      { $inc: { quantity: -m.quantity } }
    );
  }
  next();
});

feedProductionSchema.post("findOneAndUpdate", async function (doc, next) {
  if (!doc?.deleted) return next();

  const formulaDoc = await formula.findOne({ _id: doc.formula });
  if (!formulaDoc) return next();

  for (const m of formulaDoc.materials) {
    await material.updateOne(
      { _id: m.material },
      { $inc: { quantity: m.quantity } }
    );
  }
  next();
});

export default model("FeedProduction", feedProductionSchema);
