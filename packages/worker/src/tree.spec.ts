import { test, describe, expect } from "bun:test";
import { Tree } from "./tree";
import { INode } from "./inode";

describe("tree creation", () => {
  test("simple stuff", () => {
    const tree = new Tree(
      "root",
      new Tree("child a", new Tree("cousin a"), new Tree("cousin b")),
      new Tree("child b"),
      new Tree(
        "child c",
        new Tree(
          "grandchild 1",
          new Tree("greatgrandchild 1"),
          new Tree("greatgrandchild 1")
        ),
        new Tree("grandchild 2")
      )
    );

    console.log(tree.toString());
  });
  test("empty children", () => {
    const tree = new Tree("root");

    console.log(tree.toString());
  });
  test("find subtree in a tree that exists", () => {
    const tree = new Tree(
      "root",
      new Tree("child a", new Tree("cousin a"), new Tree("cousin b")),
      new Tree("child b"),
      new Tree(
        "child c",
        new Tree(
          "grandchild 1",
          new Tree("greatgrandchild 1"),
          new Tree("greatgrandchild 1")
        ),
        new Tree("grandchild 2")
      )
    );
    const subtree = tree.find("grandchild 1");
    expect(subtree).not.toBeUndefined();
  });
  test("find subtree in a tree that does not exist", () => {
    const tree = new Tree(
      "root",
      new Tree("child a", new Tree("cousin a"), new Tree("cousin b")),
      new Tree("child b"),
      new Tree(
        "child c",
        new Tree(
          "grandchild 1",
          new Tree("greatgrandchild 1"),
          new Tree("greatgrandchild 1")
        ),
        new Tree("grandchild 2")
      )
    );
    const subtree = tree.find("lion");
    expect(subtree).toBeUndefined();
  });

  test("JSON.stringify a tree", () => {
    const tree = new Tree(
      "root",
      new Tree("child a", new Tree("cousin a"), new Tree("cousin b")),
      new Tree("child b"),
      new Tree(
        "child c",
        new Tree(
          "grandchild 1",
          new Tree("greatgrandchild 1"),
          new Tree("greatgrandchild 1")
        ),
        new Tree("grandchild 2")
      )
    );
    console.log(tree.toJSON(2));
  });

  test("tree with objects", () => {
    const tree = new Tree(
      new INode({ key: "all-things-must-end" }),
      new Tree(
        new INode({ key: "mp3" }),
        new Tree(
          new INode({
            key: "01_All That Could Have Been.mp3",
            object: "all-things-must-end/mp3/01_All That Could Have Been.mp3",
          })
        ),
        new Tree(
          new INode({
            key: "02_Nur Für Einen Augenblick.mp3",
            object: "all-things-must-end/mp3/02_Nur Für Einen Augenblick.mp3",
          })
        )
      ),
      new Tree(
        new INode({ key: "flac" }),
        new Tree(
          new INode({
            key: "01_All That Could Have Been.flac",
            object: "all-things-must-end/flac/01_All That Could Have Been.flac",
          })
        ),
        new Tree(
          new INode({
            key: "02_Nur Für Einen Augenblick.flac",
            object: "all-things-must-end/flac/02_Nur Für Einen Augenblick.flac",
          })
        )
      )
    );

    console.log(tree.toString(2, "/"))
  });
});
