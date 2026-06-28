import { describe, expect, it } from "vitest";
import { searchActions } from "../search";
import type { RegisteredAction } from "../types";

const actions: RegisteredAction[] = [
  {
    id: "save",
    title: "Save Document",
    description: "Write changes to disk",
    group: "File",
    keywords: ["persist"],
    execute: () => undefined
  },
  {
    id: "archive",
    title: "Archive Item",
    description: "Move item out of the inbox",
    group: "Inbox",
    keywords: ["store"],
    execute: () => undefined
  },
  {
    id: "hidden",
    title: "Hidden Action",
    hidden: true,
    execute: () => undefined
  }
];

describe("searchActions", () => {
  it("returns visible actions sorted by title for an empty query", () => {
    expect(searchActions(actions, "").map((action) => action.id)).toEqual(["archive", "save"]);
  });

  it("ranks exact title matches above keyword and description matches", () => {
    const results = searchActions(actions, "save");
    expect(results[0]?.id).toBe("save");
  });

  it("matches keywords, groups, and descriptions", () => {
    expect(searchActions(actions, "persist").map((action) => action.id)).toEqual(["save"]);
    expect(searchActions(actions, "inbox").map((action) => action.id)).toEqual(["archive"]);
    expect(searchActions(actions, "disk").map((action) => action.id)).toEqual(["save"]);
  });

  it("excludes hidden actions", () => {
    expect(searchActions(actions, "hidden")).toEqual([]);
  });
});
