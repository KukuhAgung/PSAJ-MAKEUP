import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateComment(comment: string, maxLength: number = 50): string {
  if (!comment) return "";
  if (comment.length <= maxLength) return `“${comment}”`;
  return comment.slice(0, maxLength) + "...";
}

