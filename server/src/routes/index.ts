import { Router } from "express";
import getRouter from "@routes/common";

import pingRouter from "@routes/ping";

import birdMortality from "@models/bird.mortality";
import birdPurchase from "@models/bird.purchase";
import birdSale from "@models/bird.sale";
import eggsProduction from "@models/eggs.production";
import eggsSale from "@models/eggs.sale";
import feedProduction from "@models/feed.production";
import feedPurchase from "@models/feed.purchase";
import feedSale from "@models/feed.sale";
import flock from "@models/flock";
import formula from "@models/formula";
import manure from "@models/manure.sale";
import material from "@models/material";
import other from "@models/other";
import vaccine from "@models/vaccine";

const ROUTER = [
  { model: birdMortality, path: "bird/mortality" },
  { model: birdPurchase, path: "bird/purchase" },
  { model: birdSale, path: "bird/sale" },
  { model: eggsProduction, path: "eggs/production" },
  { model: eggsSale, path: "eggs/sale" },
  { model: feedProduction, path: "feed/production" },
  { model: feedPurchase, path: "feed/purchase" },
  { model: feedSale, path: "feed/sale" },
  { model: flock, path: "flock" },
  { model: formula, path: "formula" },
  { model: manure, path: "manure" },
  { model: material, path: "material" },
  { model: other, path: "other" },
  { model: vaccine, path: "vaccine" },
];

const router = Router();

router.use("/ping", pingRouter);

ROUTER.forEach(({ model, path }) => {
  router.use(`/${path}`, getRouter(model));
});

export default router;
