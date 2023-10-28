import type { NextFunction, Request, Response } from "express";
import * as xlsx from "xlsx";
import * as zod from "zod";
import * as mongo from "../mongo";
import createOzmapBox from "../ozmap/createBox";
import createOzmapSplitter from "../ozmap/createSplitter";
import findOzmapBoxTypes from "../ozmap/findBoxTypes";
import findOzmapSplitterTypes from "../ozmap/findSplitterTypes";

export default async function create(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // * file validation

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

    // * open file

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

    // * sheet names validation

    const allowedSheetNames = ["Boxes", "Splitters", "Clients"];

    if (workbook.SheetNames.some((name) => !allowedSheetNames.includes(name))) {
      res.status(400);
      const values = allowedSheetNames.join(", ");
      const message = `SheetName must be one of following values: ${values}`;
      res.send({ message });
      return;
    }

    // * convert boxes sheet to json

    const boxSheet = workbook.Sheets["Boxes"] as xlsx.WorkSheet;
    const boxData = xlsx.utils.sheet_to_json(boxSheet);
    const boxRows = boxData as Array<Record<string, unknown>>;

    // * convert splitters sheet to json

    const splitterSheet = workbook.Sheets["Splitters"] as xlsx.WorkSheet;
    const splitterData = xlsx.utils.sheet_to_json(splitterSheet);
    const splitterRows = splitterData as Array<Record<string, unknown>>;

    // * get box types

    const { rows: boxTypesList } = await findOzmapBoxTypes();

    const boxTypesMap = boxTypesList.reduce<Record<string, string>>(
      (object, boxType) => ({ ...object, [boxType.code]: boxType.id }),
      {}
    );

    const boxTypesKeys = Object.keys(boxTypesMap);

    // * boxes json validation

    const boxSchema = zod.z
      .object({
        Name: zod.z.string(),
        Latitude: zod.z.string(),
        Longitude: zod.z.string(),
        Level: zod.z.number(),
        Type: zod.z.string().refine(
          (value) => boxTypesKeys.includes(value),
          (value) => ({ message: `${value} must be one of following values: ${boxTypesKeys.join(", ")}` }),
        ),
      })
      .array();

    const boxValidation = boxSchema.safeParse(boxRows);

    if (!boxValidation.success) {
      res.status(400);
      const { format } = new Intl.ListFormat("en-US");
      res.send({ message: format(boxValidation.error.format()._errors) });
      return;
    }

    // * get splitter types

    const { rows: splitterTypesList } = await findOzmapSplitterTypes();

    const splitterTypesMap = splitterTypesList.reduce<Record<string, string>>(
      (object, splitterType) => ({ ...object, [splitterType.code]: splitterType.id }),
      {}
    );

    const splitterTypesKeys = Object.keys(splitterTypesMap);

    // * splitters json validation

    const splitterSchema = zod.z
      .object({
        Name: zod.z.string().refine(
          (value) => boxValidation.data.some((box) => box.Name === value),
          (value) => ({ message: `${value} must be a valid box name` })
        ),
        Box: zod.z.string(),
        implanted: zod.z.enum(["Yes", "No"]),
        Inputs: zod.z.number(),
        Outputs: zod.z.number(),
        "Allows client connection": zod.z.enum(["Yes", "No"]),
        Type: zod.z.string().refine(
          (value) => splitterTypesKeys.includes(value),
          (value) => ({ message: `${value} must be one of following values: ${splitterTypesKeys.join(", ")}` }),
        ),
      })
      .array();

    const splitterValidation = splitterSchema.safeParse(splitterRows);

    if (!splitterValidation.success) {
      res.status(400);
      const { format } = new Intl.ListFormat("en-US");
      res.send({ message: format(splitterValidation.error.format()._errors) });
      return;
    }

    // * create boxes in ozmap database + save in mongodb

    const boxes: Array<Awaited<ReturnType<typeof createOzmapBox>>> = [];

    for (const box of boxValidation.data) {
      const boxType = boxTypesMap[box.Type] as string; // validated

      const document = await mongo.client.db().collection("boxes").findOne({
        ...box,
        Project: req.ozmapProjectId,
      });

      if (document !== null) {
        continue; // already sended
      }

      const result = await createOzmapBox({
        lat: box.Latitude,
        lng: box.Longitude,
        implanted: true,
        project: req.ozmapProjectId,
        boxType: boxType,
        hierarchyLevel: box.Level,
        coords: [null, null],
        name: box.Name,
      });

      await mongo.client.db().collection("boxes").insertOne({
        ...box,
        Project: req.ozmapProjectId,
        ozmap: result,
      });

      boxes.push(result);
    }

    // * create splitters on ozmap database + save in mongodb

    for (const splitter of splitterValidation.data) {
      const splitterType = splitterTypesMap[splitter.Type] as string; // validated

      const { id: splitterParent } = boxes.find(
        (box) => box.name === splitter.Box
      ) as Awaited<ReturnType<typeof createOzmapBox>>; // validated

      const document = await mongo.client.db().collection("splitters").findOne({
        ...splitter,
        Project: req.ozmapProjectId,
      });

      if (document !== null) {
        continue; // already sended
      }

      const result = await createOzmapSplitter({
        name: splitter.Name,
        splitterType: splitterType,
        parent: splitterParent,
        ratio: { input: splitter.Inputs, output: splitter.Outputs },
        project: req.ozmapProjectId,
        implanted: splitter.implanted === "Yes",
        isDrop: splitter["Allows client connection"] === "Yes"
      });

      await mongo.client.db().collection("splitters").insertOne({
        ...splitter,
        Project: req.ozmapProjectId,
        ozmap: result,
      });
    }

    res.send({ message: "file received successfully" });
  } catch (err) {
    next(err);
  }
}
