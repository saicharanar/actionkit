import { describe, expect, it, vi } from "vitest";
import {
  findActionForKeyboardEvent,
  getEffectiveShortcut,
  normalizeShortcut,
  shortcutConflicts,
  shortcutMatchesEvent,
  shouldIgnoreKeyboardTarget
} from "../shortcuts";
import type { RegisteredAction } from "../types";

const actions: RegisteredAction[] = [
  {
    id: "save",
    title: "Save",
    shortcut: "mod+s",
    execute: vi.fn()
  },
  {
    id: "archive",
    title: "Archive",
    shortcut: "shift+a",
    execute: vi.fn()
  },
  {
    id: "disabled",
    title: "Disabled",
    shortcut: "mod+d",
    disabled: true,
    execute: vi.fn()
  }
];

describe("shortcuts", () => {
  it("normalizes aliases and modifier order", () => {
    expect(normalizeShortcut("Shift + Cmd + S")).toBe("mod+shift+s");
    expect(normalizeShortcut("Control + Option + Enter")).toBe("ctrl+alt+enter");
  });

  it("matches keyboard events against normalized shortcuts", () => {
    const ctrlEvent = new KeyboardEvent("keydown", { key: "s", ctrlKey: true });
    expect(shortcutMatchesEvent("mod+s", ctrlEvent)).toBe(true);
    expect(shortcutMatchesEvent("mod+shift+s", ctrlEvent)).toBe(false);
  });

  it("resolves user overrides before default shortcuts", () => {
    expect(getEffectiveShortcut(actions[0], { save: "shift+s" })).toBe("shift+s");
  });

  it("finds enabled visible actions for keyboard events", () => {
    const saveEvent = new KeyboardEvent("keydown", { key: "s", ctrlKey: true });
    const disabledEvent = new KeyboardEvent("keydown", { key: "d", ctrlKey: true });

    expect(findActionForKeyboardEvent(saveEvent, actions, {})?.id).toBe("save");
    expect(findActionForKeyboardEvent(disabledEvent, actions, {})).toBeUndefined();
  });

  it("detects shortcut conflicts against effective bindings", () => {
    expect(shortcutConflicts("archive", "mod+s", actions, {})).toBe(true);
    expect(shortcutConflicts("archive", "mod+p", actions, { save: "mod+p" })).toBe(true);
    expect(shortcutConflicts("archive", "mod+o", actions, {})).toBe(false);
  });

  it("identifies editable keyboard targets", () => {
    expect(shouldIgnoreKeyboardTarget(document.createElement("input"))).toBe(true);
    expect(shouldIgnoreKeyboardTarget(document.createElement("textarea"))).toBe(true);
    expect(shouldIgnoreKeyboardTarget(document.createElement("button"))).toBe(false);
  });
});
