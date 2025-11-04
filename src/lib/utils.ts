import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 60000 = 60 seconds
// 1000 = 1 second
export const MILI_TO_MIN = 60000;
export const MILI_TO_SEC = 1000;

// Helper function to format duration
export const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / MILI_TO_MIN);
  const seconds = Math.floor((ms % MILI_TO_MIN) / MILI_TO_SEC);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const generateRandomString = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};
