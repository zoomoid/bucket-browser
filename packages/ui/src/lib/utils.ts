import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function logN(n: number, b: number): number {
  return Math.log(n) / Math.log(b);
}

function humanateBytes(s: number, base: number, sizes: string[]): string {
  if (s < 10) {
    return `${s} B`;
  }
  const e = Math.floor(logN(s, base));
  const suffix = sizes[e];
  const val = Math.floor((s / Math.pow(base, e)) * 10 + 0.5) / 10;
  if (val < 10) {
    return `${val.toFixed(1)} ${suffix}`;
  }
  return `${val.toFixed(0)} ${suffix}`;
}

export function bytes(s: number): string {
  const sizes = ["B", "kB", "MB", "GB", "TB", "PB", "EB"];
  return humanateBytes(s, 1000, sizes);
}

export function iBytes(s: number): string {
  const sizes = ["B", "kiB", "MiB", "GiB", "TiB", "PiB", "EiB"];
  return humanateBytes(s, 1024, sizes);
}
