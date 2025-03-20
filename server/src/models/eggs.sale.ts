import { Schema, model } from "mongoose";
import flock from "./flock";
import customer from "./customer";

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
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
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

  const totalAmount = (doc.quantity * doc.rate) / 100;
  const balanceChange = doc.amountPaid - totalAmount;

  await customer.updateOne(
    { _id: doc.customer },
    { $inc: { balance: balanceChange } }
  );

  next();
});

eggsSales.post("findOneAndUpdate", async function (doc, next) {
  if (doc?.deleted) {
    await flock.updateOne({ _id: doc.flock }, { $inc: { eggs: doc.quantity } });

    const totalAmount = (doc.quantity * doc.rate) / 100;
    const balanceChange = totalAmount - doc.amountPaid;

    await customer.updateOne(
      { _id: doc.customer },
      { $inc: { balance: balanceChange } }
    );
  }
  next();
});

export default model("EggsSale", eggsSales);
