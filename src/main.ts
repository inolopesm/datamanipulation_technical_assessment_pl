import * as express from "express";
import * as multer from "multer";
import * as xlsx from "xlsx";
import type { NextFunction, Request, Response } from "express";

const app = express();

app.post(
  "/",
  multer({ storage: multer.memoryStorage() }).single("file"),
  async (req, res, next) => {
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

      workbook.SheetNames.forEach((name) => {
        const sheet = workbook.Sheets[name] as xlsx.WorkSheet;
        const data = xlsx.utils.sheet_to_json(sheet);
        const rows = data as Array<Record<string, unknown>>;

        rows.forEach((row) => {
          console.log(row);
        });
      });

      res.send({ message: "file received successfully" });
    } catch (err) {
      next(err);
    }
  }
);

app.all("*", (req, res) => res.send({ message: "route not found" }));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.send({ message: "internal server error" });
});

const server = app.listen(3000, "0.0.0.0", () =>
  console.log(`server listening on http://0.0.0.0:3000`)
);

["SIGINT", "SIGTERM"].forEach((signal) =>
  process.on(signal, () => {
    console.log(`\n${signal} received`);
    console.log(
      "stopping server from accepting new connections but keeping existing connections..."
    );

    server.close((err) => {
      if (err) throw err;
      console.log("server closed");
      process.exit(0);
    });
  })
);
