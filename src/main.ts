import * as express from "express";
import type { NextFunction, Request, Response } from "express";

const app = express();

app.all("*", (req, res) => res.send({ message: "route not found" }));

app.use((err: Error, req: Request, res: Response, next: NextFunction) =>
  res.send({ message: "internal server error" })
);

const server = app.listen(3000, "0.0.0.0", () =>
  console.log(`listening on http://0.0.0.0:3000`)
);

["SIGINT", "SIGTERM"].forEach((signal) =>
  process.on(signal, () => {
    console.log(`\n${signal} received`);
    console.log("stopping server from accepting new connections but keeping existing connections...");

    server.close((err) => {
      if (err) throw err;
      console.log("server closed");
      process.exit(0);
    });
  })
);
