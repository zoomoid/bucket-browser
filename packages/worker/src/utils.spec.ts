import { test, describe, expect } from "bun:test";
import { convertObjectListToTree } from "./utils";
import { BucketIndex } from "./bucket-index";

const objects = [
  "all-things-must-end/aac/01_All That Could Have Been.m4a",
  "all-things-must-end/aac/02_Nur Für Einen Augenblick.m4a",
  "all-things-must-end/aac/03_Ein Tag Im April (Interlude).m4a",
  "all-things-must-end/aac/04_Angst vor der Zukunft.m4a",
  "all-things-must-end/aac/05_Outer Space (Reprise).m4a",
  "all-things-must-end/aac/06_Illusions.m4a",
  "all-things-must-end/aac/07_Delay (Long Version).m4a",
  "all-things-must-end/aac/08_Maybe Someday.m4a",
  "all-things-must-end/aac/09_Window of Opportunity (Too Late).m4a",
  "all-things-must-end/aac/10_Lazarus.m4a",
  "all-things-must-end/aac/11_Rebirth.m4a",
  "all-things-must-end/aac/12_Anywhere Else At Any Other Time.m4a",
  "all-things-must-end/aac/13_Echoes of You.m4a",
  "all-things-must-end/aac/14_The Last Chapter.m4a",
  "all-things-must-end/aac/15_All Things Must End.m4a",
  "all-things-must-end/aac/All Things Must End (Album Mix).m4a",
  "all-things-must-end/alac/01_All That Could Have Been.m4a",
  "all-things-must-end/alac/02_Nur Für Einen Augenblick.m4a",
  "all-things-must-end/alac/03_Ein Tag Im April (Interlude).m4a",
  "all-things-must-end/alac/04_Angst vor der Zukunft.m4a",
  "all-things-must-end/alac/05_Outer Space (Reprise).m4a",
  "all-things-must-end/alac/06_Illusions.m4a",
  "all-things-must-end/alac/07_Delay (Long Version).m4a",
  "all-things-must-end/alac/08_Maybe Someday.m4a",
  "all-things-must-end/alac/09_Window of Opportunity (Too Late).m4a",
  "all-things-must-end/alac/10_Lazarus.m4a",
  "all-things-must-end/alac/11_Rebirth.m4a",
  "all-things-must-end/alac/12_Anywhere Else At Any Other Time.m4a",
  "all-things-must-end/alac/13_Echoes of You.m4a",
  "all-things-must-end/alac/14_The Last Chapter.m4a",
  "all-things-must-end/alac/15_All Things Must End.m4a",
  "all-things-must-end/alac/All Things Must End (Album Mix).m4a",
  "all-things-must-end/flac/01_All That Could Have Been.flac",
  "all-things-must-end/flac/02_Nur Für Einen Augenblick.flac",
  "all-things-must-end/flac/03_Ein Tag Im April (Interlude).flac",
  "all-things-must-end/flac/04_Angst vor der Zukunft.flac",
  "all-things-must-end/flac/05_Outer Space (Reprise).flac",
  "all-things-must-end/flac/06_Illusions.flac",
  "all-things-must-end/flac/07_Delay (Long Version).flac",
  "all-things-must-end/flac/08_Maybe Someday.flac",
  "all-things-must-end/flac/09_Window of Opportunity (Too Late).flac",
  "all-things-must-end/flac/10_Lazarus.flac",
  "all-things-must-end/flac/11_Rebirth.flac",
  "all-things-must-end/flac/12_Anywhere Else At Any Other Time.flac",
  "all-things-must-end/flac/13_Echoes of You.flac",
  "all-things-must-end/flac/14_The Last Chapter.flac",
  "all-things-must-end/flac/15_All Things Must End.flac",
  "all-things-must-end/mp3/01_All That Could Have Been.mp3",
  "all-things-must-end/mp3/02_Nur Für Einen Augenblick.mp3",
  "all-things-must-end/mp3/03_Ein Tag Im April (Interlude).mp3",
  "all-things-must-end/mp3/04_Angst vor der Zukunft.mp3",
  "all-things-must-end/mp3/05_Outer Space (Reprise).mp3",
  "all-things-must-end/mp3/06_Illusions.mp3",
  "all-things-must-end/mp3/07_Delay (Long Version).mp3",
  "all-things-must-end/mp3/08_Maybe Someday.mp3",
  "all-things-must-end/mp3/09_Window of Opportunity (Too Late).mp3",
  "all-things-must-end/mp3/10_Lazarus.mp3",
];

describe("convertObjectListToTree", () => {
  test("create", async () => {
    const bucketName = process.env.BUCKET_NAME!;
    const bucketEndpoint = process.env.BUCKET_ENDPOINT!;
    const bucketRegion = process.env.REGION!;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

    const lister = new BucketIndex(
      bucketName,
      bucketEndpoint,
      bucketRegion,
      accessKeyId,
      secretAccessKey
    );

    const t = convertObjectListToTree("zoomoid-de", await lister.listBucket());

    // console.log(t.toString(2, "/"));

    console.log(t.toJSON(2))
  });
});
