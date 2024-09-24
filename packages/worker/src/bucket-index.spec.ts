import { test, describe, expect } from "bun:test";
import { BucketIndex } from "./bucket-index";

describe("list real bucket", () => {
  test("zoomoid-de", async () => {
    const bucketName = process.env.BUCKET_NAME!
    const bucketEndpoint = process.env.BUCKET_ENDPOINT!
    const bucketRegion = process.env.REGION!
    const accessKeyId  = process.env.AWS_ACCESS_KEY_ID!
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!

    const lister = new BucketIndex(bucketName, bucketEndpoint, bucketRegion, accessKeyId, secretAccessKey)

    console.log(await lister.getLatest())
  })
})