import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePlaceholder(seed: string | number, text?: string) {
  const hash = String(seed).split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const colorIndex = Math.abs(hash);
  const colors = ['135c4a', 'e8f5e9', 'ffebee', 'e3f2fd', 'fff3e0', 'f3e5f5', 'e0f7fa', 'fce4ec'];
  const color = colors[colorIndex % colors.length];
  const textColor = colorIndex % colors.length === 0 ? 'fff' : '333';
  const displayText = text || seed;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#${color}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="#${textColor}">${displayText}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
