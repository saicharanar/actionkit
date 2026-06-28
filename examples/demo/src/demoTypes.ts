import type { RefObject } from "react";

export interface LaunchRequest {
  title: string;
  owner: string;
  priority: "Low" | "Medium" | "High";
  targetDate: string;
  summary: string;
}

export interface FieldRefs {
  title: RefObject<HTMLInputElement | null>;
  owner: RefObject<HTMLInputElement | null>;
  summary: RefObject<HTMLTextAreaElement | null>;
}

export interface ActivityItem {
  id: number;
  label: string;
}
