import { describe, expect, it, vi } from "vitest";
import { ActionRegistry } from "../registry";

describe("ActionRegistry", () => {
  it("registers, replaces duplicate ids, and unregisters the current action", () => {
    const registry = new ActionRegistry();
    const unregisterFirst = registry.register({
      id: "save",
      title: "Save Draft",
      execute: vi.fn()
    });
    const unregisterSecond = registry.register({
      id: "save",
      title: "Save Document",
      execute: vi.fn()
    });

    expect(registry.getAll()).toHaveLength(1);
    expect(registry.get("save")?.title).toBe("Save Document");

    unregisterFirst();
    expect(registry.get("save")?.title).toBe("Save Document");

    unregisterSecond();
    expect(registry.get("save")).toBeUndefined();
  });

  it("does not execute missing or disabled actions", async () => {
    const registry = new ActionRegistry();
    const execute = vi.fn();

    registry.register({
      id: "archive",
      title: "Archive",
      disabled: true,
      execute
    });

    await expect(registry.execute("missing")).resolves.toBe(false);
    await expect(registry.execute("archive")).resolves.toBe(false);
    expect(execute).not.toHaveBeenCalled();
  });

  it("propagates execution errors", async () => {
    const registry = new ActionRegistry();

    registry.register({
      id: "publish",
      title: "Publish",
      execute: () => {
        throw new Error("Publish failed");
      }
    });

    await expect(registry.execute("publish")).rejects.toThrow("Publish failed");
  });
});
