import Router from "express";

import * as commonController from "../controllers/common";
import { Model } from "mongoose";

const router = (model: Model<any>) => {
  const r = Router();

  r.get("/", commonController.getAll(model));
  r.get("/:id", commonController.getOne(model));
  r.post("/", commonController.create(model));
  r.put("/:id", commonController.update(model));
  r.delete("/:id", commonController.remove(model));

  return r;
};

export default router;
