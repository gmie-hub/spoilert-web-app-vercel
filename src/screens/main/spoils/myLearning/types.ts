import type { StaticImageData } from "next/image";

export type MyLearningTabKey = "ongoing" | "completed";

export interface LearningItem {
  id: number;
  title: string;
  category: string;
  coverImage: string | StaticImageData;
  progress: number;
  raw?: Record<string, unknown>;
}

