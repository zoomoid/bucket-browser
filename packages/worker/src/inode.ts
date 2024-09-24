export class INode {
  key: string;
  object: string | null = null;
  lastModified: Date | null = null;
  size: number | null = null;

  constructor({
    key,
    object,
    lastModified,
    size,
  }: {
    key: string;
    object?: string;
    lastModified?: Date;
    size?: number;
  }) {
    this.key = key;
    if (object) this.object = object;
    if (lastModified) this.lastModified = lastModified;
    if (size) this.size = size;
  }

  isEqual(b: INode) {
    return (
      this.key == b.key &&
      this.object == b.object &&
      this.lastModified == b.lastModified &&
      this.size == b.size
    );
  }

  toString(): string {
    let s = this.key
    if(this.object) {
      s += ` [${this.object}]`
    }
    if(this.lastModified) {
      s += ` (Last Modified: ${new Date(this.lastModified)})`
    }
    if(this.size) {
      s += ` ${this.size}B`
    }
    return s
  }
}
