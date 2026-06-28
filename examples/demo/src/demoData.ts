import type { ActivityItem, LaunchRequest } from "./demoTypes";

export const initialRequest: LaunchRequest = {
  title: "Customer billing portal",
  owner: "Maya Chen",
  priority: "High",
  targetDate: "2026-07-15",
  summary: "Ship a first-pass portal for invoice search, payment status, and account-level billing contacts."
};

export const initialActivity: ActivityItem[] = [{ id: 1, label: "Draft restored from local workspace" }];
