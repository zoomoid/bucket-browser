interface Stringer {
  toString(): string;
}

interface Comparable<T> {
  isEqual?(b: ThisType<T>): boolean;
}

type NodeContent = Stringer & Comparable<any>;

class Node<T extends NodeContent> {
  content: T;
  constructor(content: T) {
    this.content = content;
  }

  toString(): string {
    return this.content.toString();
  }

  valueOf(): string {
    return this.toString();
  }

  toJSON(): string {
    return JSON.stringify(this.content);
  }

  isEqual(b: T): boolean {
    if (typeof this.content.isEqual === "function") {
      return this.content.isEqual(b);
    }
    return this.content == b;
  }
}

export class Tree<T extends NodeContent> {
  content: Node<T>;
  children: Array<Tree<T>> = [];

  parent: Tree<T> | null = null;

  constructor(content: T, ...children: Array<Tree<T>>) {
    this.content = new Node(content);
    for (const child of children) {
      this.append(child);
    }
  }

  toString(indentation: number = 2, suffix: string = ""): string {
    return this.subTreeToString(indentation, 0, suffix);
  }

  append(child: Tree<T>) {
    child.parent = this;
    this.children.push(child);
  }

  find(needle: T): Tree<T> | undefined {
    if (this.content.isEqual(needle)) {
      return this;
    }
    for (const child of this.children) {
      const found = child.find(needle);
      if (found) {
        return found;
      }
    }
    return undefined;
  }

  getOrCreate(needle: T): Tree<T> {
    const exists = this.find(needle);
    if (exists) {
      return exists;
    }

    const subtree = new Tree(needle);
    this.append(subtree);
    return subtree;
  }

  protected subTreeToString(
    indentation: number = 0,
    depth: number = 0,
    suffix: string = ""
  ): string {
    const b = new MultiLineStringBuilder();
    b.append(this.content.toString());
    if (this.children.length > 0) {
      b.append(suffix);
    }
    for (const child of this.children) {
      b.newline()
        .indent(indentation * (depth + 1))
        .append(child.subTreeToString(indentation, depth + 1, suffix));
    }

    return b.finalize();
  }

  toPrimitives(): PrimitiveTree<T> {
    if (this.children.length == 0) {
      return this.content.content
    }
    return {
      key: this.content.content.toString(),
      children: this.children.map((t) => t.toPrimitives()),
    };
  }

  toJSON(space?: number | string): string {
    return JSON.stringify(
      this.toPrimitives(),
      (key, value) => {
        const isEmpty = (value: unknown) => {
          if (value === null || value === undefined) {
            return true;
          }

          if (Array.isArray(value)) {
            return value.every(isEmpty);
          } else if (typeof value === "object") {
            return Object.values(value).every(isEmpty);
          }

          return false;
        };
        return isEmpty(value) ? undefined : value;
      },
      space
    );
  }
}

type PrimitiveTree<T> =
  | { key: string; children: Array<PrimitiveTree<T>> }
  | T;

class MultiLineStringBuilder {
  buffer: string = "";

  newline(): MultiLineStringBuilder {
    this.buffer += "\n";
    return this;
  }

  indent(spaces: number = 0): MultiLineStringBuilder {
    this.buffer += " ".repeat(spaces);
    return this;
  }

  append(s: string): MultiLineStringBuilder {
    this.buffer += s;
    return this;
  }

  finalize(): string {
    return this.buffer;
  }
}
