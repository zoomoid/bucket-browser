import { ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import type { Logger } from "pino";

export class BucketIndex {
  private client: S3Client;

  private cache: Awaited<ReturnType<BucketIndex["listBucket"]>> | null = null;
  private logger: Logger;
  constructor(
    private bucketName: string,
    bucketEndpoint: string | URL,
    bucketRegion: string,
    accessKeyId: string,
    secretAccessKey: string,
    logger: Logger,
    private cacheDurationSeconds: number = 60 * 15 // 15 min cache lifetime
  ) {
    this.client = new S3Client({
      region: bucketRegion,
      endpoint: bucketEndpoint.toString(),
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId: accessKeyId,
              secretAccessKey: secretAccessKey,
            }
          : undefined,
    });

    this.logger = logger.child({ kind: BucketIndex.name });
  }

  start() {
    this.logger.debug("Starting scheduled cache refresh");
    setInterval(async () => {
      this.logger.debug("refreshing state");
      const list = await this.listBucket();
      this.cache = list;
    }, this.cacheDurationSeconds * 1000);
  }

  async get() {
    if (this.cache === null) {
      // if cache is empty, retrieve from upstream and cache
      await this.listBucket();
    }
    return this.cache!;
  }

  async getLatest() {
    this.logger.debug("force-updating cache");
    return this.listBucket();
  }

  private async listBucket() {
    const listBucketCommand = new ListObjectsCommand({
      Bucket: this.bucketName,
    });

    const resp = await this.client.send(listBucketCommand);

    const list = resp.Contents?.map((o) => ({
      key: o.Key as string,
      lastModified: o.LastModified,
      size: o.Size,
    }));
    this.cache = list;
    return list;
  }
}
