import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import config from "./app/config";
import router from "./app/routes";
// import cron from "node-cron";
import notFound from "./app/middlewares/notFound";
import globalErrorHandelar from "./app/middlewares/globalErrorHandler";

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

const app = express();

app.use(cookieParser());

app.use(
  bodyParser.json({
    verify: function (
      req: express.Request,
      res: express.Response,
      buf: Buffer,
    ) {
      req.rawBody = buf;
    },
  }),
);

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  config.file_path as string,
  express.static(path.join(__dirname, "public")),
);

app.use(cors());

// delete expaire subscription auto delete

app.get("/", (_req, res) => {
  res.send({
    status: true,
    message: "Welcome to omerabashar backend Api",
  });
});

app.use("/api/v1", router);
app.use(notFound);
app.use(globalErrorHandelar);

export default app;
