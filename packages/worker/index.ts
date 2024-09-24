import express from "express";
import { BucketIndex } from "./src/bucket-index";
import { convertObjectListToTree } from "./src/utils";
import cors from "cors"
import pino from "pino"

const app = express();
const port = 3000;

const bucketName = process.env.BUCKET_NAME!;
const bucketEndpoint = new URL(process.env.BUCKET_ENDPOINT!) ?? "";
const bucketRegion = process.env.REGION!;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? "";

const logger = pino({
  level: process.env.LOG_LEVEL ?? "debug"
})

logger.debug({
  bucketName,
  bucketEndpoint: bucketEndpoint.toString(),
  bucketRegion: bucketRegion,
  accessKeyId: accessKeyId ? "***" : "",
  secretAccessKey: secretAccessKey ? "***" : ""
})

const lister = new BucketIndex(
  bucketName,
  bucketEndpoint,
  bucketRegion,
  accessKeyId,
  secretAccessKey,
  logger,
)

lister.start()

app.use(cors())

app.get("/api", async (req, res) => {
  let list: Awaited<ReturnType<BucketIndex["listBucket"]>>
  if (req.headers["cache-control"] && req.headers["cache-control"] == "no-cache") {
    // get fresh list, otherwise serve from cache
    list = await lister.getLatest()
  } else {
    list = await lister.get()
  }

  const tree = convertObjectListToTree(bucketName, list)

  res.setHeader("content-type", "application/json").send(tree.toJSON()).end()
});

const staticRedirectPrefix = /^\/api\/static\//

app.get(staticRedirectPrefix, async (req, res) => {
  const objectPath = req.path.replace(staticRedirectPrefix, "")

  // fully-qualified path to the bucket
  const objectURL = new URL(bucketEndpoint)
  objectURL.host = `${bucketName}.${bucketEndpoint.host}`
  objectURL.pathname = objectPath

  logger.debug(`Redirecting request to upstream: ${objectURL.toString()}`)

  res.redirect(objectURL.toString())
})

app.get("/healthz", (_, res) => {
  res.send("ok")
})

app.listen(port, () => {
  logger.info(`Starting lister server on port ${port}`);
});
