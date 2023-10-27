import type { NextFunction, Request, Response } from "express";
import * as xlsx from "xlsx";
import * as mongo from "./mongo";

export async function findByCollection(
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

export async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.file === undefined) {
      res.status(400);
      res.send({ message: "file is a required field" });
      return;
    }

    if (!req.file.originalname.endsWith(".xls")) {
      res.status(400);
      res.send({ message: "file must be an xls file" });
      return;
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

    const allowedSheetNames = ["Boxes", "Splitters", "Clients"];

    if (workbook.SheetNames.some((name) => !allowedSheetNames.includes(name))) {
      res.status(400);
      const values = allowedSheetNames.join(", ");
      const message = `SheetName must be one of following values: ${values}`;
      res.send({ message });
      return;
    }

    await Promise.all(
      workbook.SheetNames.map(async (name) => {
        const sheet = workbook.Sheets[name] as xlsx.WorkSheet;
        const data = xlsx.utils.sheet_to_json(sheet);
        const rows = data as Array<Record<string, unknown>>;
        for (const row of rows) row.project = req.ozmapProjectId;

        await mongo.client
          .db()
          .collection(name.toLowerCase())
          .insertMany(rows);
      })
    );

    res.send({ message: "file received successfully" });
  } catch (err) {
    next(err);
  }
}
