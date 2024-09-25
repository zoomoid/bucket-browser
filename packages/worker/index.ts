import express, { type Request, type Response } from "express";
import { BucketIndex } from "./src/bucket-index";
import { convertObjectListToTree } from "./src/utils";
import cors from "cors";
import pino from "pino";
import { fetch } from "bun";

const app = express();
const port = 3000;

const bucketName = process.env.BUCKET_NAME!;
const bucketEndpoint = new URL(process.env.BUCKET_ENDPOINT!) ?? "";
const bucketRegion = process.env.REGION!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? "";

const logger = pino({
  level: process.env.LOG_LEVEL ?? "debug",
});

logger.debug({
  bucketName,
  bucketEndpoint: bucketEndpoint.toString(),
  bucketRegion: bucketRegion,
  accessKeyId: accessKeyId ? "***" : "",
  secretAccessKey: secretAccessKey ? "***" : "",
});

const lister = new BucketIndex(
  bucketName,
  bucketEndpoint,
  bucketRegion,
  accessKeyId,
  secretAccessKey,
  logger
);

lister.start();

app.use(cors());

app.get("/api/objects", async (req, res) => {
  let list: Awaited<ReturnType<BucketIndex["listBucket"]>>;
  if (
    req.headers["cache-control"] &&
    req.headers["cache-control"] == "no-cache"
  ) {
    // get fresh list, otherwise serve from cache
    list = await lister.getLatest();
  } else {
    list = await lister.get();
  }

  const tree = convertObjectListToTree(bucketName, list);

  return res
    .setHeader("content-type", "application/json")
    .send(tree.toJSON())
    .end();
});

const staticRedirectPrefix = "/static/";

app.get("/static/:path(*)", async (req: Request, res: Response) => {
  // @ts-ignore because the @types/express package does some type level stuff to extract the param, but is not aware of regex
  const objectPath = req.params.path;

  // fully-qualified path to the bucket
  const objectURL = new URL(bucketEndpoint);
  objectURL.host = `${bucketName}.${bucketEndpoint.host}`;
  objectURL.pathname = objectPath;

  logger.debug(`Streaming request to upstream: ${objectURL.toString()}`);

  const resp = await fetch(objectURL);

  if (!resp.ok) {
    return res.send(`Failed to fetch from ${objectURL.toString()}`);
  }

  const contentType = resp.headers.get("content-type")!;
  const contentDisposition = resp.headers.get("content-disposition")!;
  const contentLength = resp.headers.get("content-length")!;

  res
    .setHeader("content-type", contentType)
    .setHeader("content-disposition", contentDisposition)
    .setHeader("content-length", contentLength);

  const stream = new WritableStream({
    write(chunk) {
      res.write(chunk);
    },
    close() {
      res.end();
    },
    abort(err) {
      console.error("Streaming error:", err);
      res.status(500).end("Internal Server Error");
    },
  });

  await resp.body?.pipeTo(stream);
});

app.get("/healthz", (_, res) => {
  return res.send("ok");
});

app.listen(port, () => {
  logger.info(`Starting lister server on port ${port}`);
});
