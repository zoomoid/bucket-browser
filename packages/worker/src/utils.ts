import type { BucketIndex } from "./bucket-index";
import { INode } from "./inode";
import { Tree } from "./tree";

export function convertObjectListToTree(
  bucketName: string,
  objects: Awaited<ReturnType<BucketIndex["listBucket"]>>
) {
  const t = new Tree(new INode({ key: bucketName }));

  objects?.forEach((p) => {
    const elements = p.key.split("/");
    let currentSubtree = t;
    for (let i = 0; i < elements.length; i++) {
      let node: INode = new INode({
        key: elements[i],
      });
      if (i === elements.length - 1) {
        // leaf node only on the last level
        node = new INode({
          key: elements[i],
          lastModified: p.lastModified,
          object: p.key,
          size: p.size,
        });
      }
      currentSubtree = currentSubtree.getOrCreate(node);
    }
  });

  return t;
}
