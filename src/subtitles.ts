export interface Subtitle {
  index: number;
  text: string;
  en?: string;
  start: number;
  end: number;
}

import data from "./subtitles.json";
export const subtitles: Subtitle[] = data as Subtitle[];
