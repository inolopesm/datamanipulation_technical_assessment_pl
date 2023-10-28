import type { NextFunction, Request, Response } from "express";
import * as mongo from "../mongo";

export default async function findByCollection(
  req: Request<{ collection: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const collections = await mongo.client.db().listCollections().toArray();

    const exists = collections.some(
      (collection) => collection.name === req.params.collection
    );

    if (!exists) {
      res.status(400);
      res.send({ message: "collection not found" });
      return;
    }

    const documents = await mongo.client
      .db()
      .collection(req.params.collection)
      .find()
      .toArray();

    res.send(documents);
  } catch (err) {
    next(err);
  }
}
