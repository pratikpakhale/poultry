import { RequestHandler } from "express";
import { Model } from "mongoose";
import { HTTP_STATUS } from "../utils/http";

export const getAll =
  (model: Model<any>): RequestHandler =>
  async (req, res, next) => {
    try {
      const {
        fromDate,
        toDate,
        page,
        limit,
        populate,
        ...otherFilters
      }: FilterParams = req.query;

      const query: any = { deleted: false };
      const hasDateField = model.schema.paths.date !== undefined;

      if (hasDateField && (fromDate || toDate)) {
        query.date = {};
        if (fromDate) query.date.$gte = new Date(fromDate);
        if (toDate) query.date.$lte = new Date(toDate);
      }

      Object.keys(otherFilters).forEach((key) => {
        if (model.schema.paths[key]) {
          try {
            const value = JSON.parse(otherFilters[key] as string);
            if (typeof value === "object" && value !== null) {
              query[key] = value;
            } else {
              query[key] = otherFilters[key];
            }
          } catch {
            query[key] = otherFilters[key];
          }
        }
      });

      const populateFields = ((populate as string) || "")
        .split(",")
        .filter(Boolean);

      if (page && limit) {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [data, total] = await Promise.all([
          model
            .find(query)
            .populate(populateFields)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
          model.countDocuments(query),
        ]);

        res.status(HTTP_STATUS.OK).json({
          data,
          metadata: {
            total,
            page: pageNum,
            limit: limitNum,
            pages: Math.ceil(total / limitNum),
          },
        });
        return;
      }

      const data = await model
        .find(query)
        .populate(populateFields)
        .sort({ createdAt: -1 });
      res.status(HTTP_STATUS.OK).json({ data });
    } catch (error) {
      next(error);
    }
  };

export const getOne =
  (model: Model<any>): RequestHandler =>
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await model.findById(id);
      res.status(HTTP_STATUS.OK).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const create =
  (model: Model<any>): RequestHandler =>
  async (req, res, next) => {
    try {
      const data = await model.create(req.body);
      res.status(HTTP_STATUS.CREATED).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const update =
  (model: Model<any>): RequestHandler =>
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await model.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      res.status(HTTP_STATUS.OK).json({
        data,
      });
    } catch (error) {
      next(error);
    }
  };

export const remove =
  (model: Model<any>): RequestHandler =>
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await model.findOneAndUpdate(
        { _id: id },
        { $set: { deleted: true } },
        { new: true }
      );
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  };
