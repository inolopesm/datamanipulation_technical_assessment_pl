import * as express from "express";
import * as controllers from "./controllers";
import * as middlewares from "./middlewares";
import * as mongo from "./mongo";
import * as ozmap from "./ozmap";

declare global {
  namespace Express {
    export interface Request {
      ozmapProjectId: string;
    }
  }
}

let server: ReturnType<ReturnType<typeof express>["listen"]>;

async function bootstrap(): Promise<void> {
  await mongo.client.connect();
  console.log("mongodb connected");

  const ozmapProjects = await ozmap.findProjects();

  if (ozmapProjects.total !== 1) {
    throw new Error("Unexpect have more than one ozmap project");
  }

  const [ozmapProject] = ozmapProjects.rows;

  if (ozmapProject === undefined) {
    throw new Error("First returned ozmap project is undefined");
  }

  console.log("ozmap project id", ozmapProject.id)

  const app = express();

  app.use((req, res, next) => {
    req.ozmapProjectId = ozmapProject.id;
    next();
  });

  app.get("/", controllers.findByCollection);
  app.post("/", middlewares.file, controllers.create);

  app.all("*", middlewares.notFound);
  app.use(middlewares.error);


  server = app.listen(3000, "0.0.0.0", () =>
    console.log(`server listening on http://0.0.0.0:3000`)
  );
}

bootstrap();

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
