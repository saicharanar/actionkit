import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ActionKitProvider } from "../ActionKitContext";
import { createLocalStorageAdapter } from "../storage";
import { useActions, useCommandPalette, useRegisterAction, useShortcutBindings } from "../hooks";
import type { ActionKitStorage } from "../types";

const originalLocalStorage = window.localStorage;

afterEach(() => {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: originalLocalStorage
  });
});

function RegisteredSaveAction({ execute }: { execute: () => void }) {
  useRegisterAction({
    id: "save",
    title: "Save Document",
    description: "Save current document",
    shortcut: "mod+s",
    keywords: ["persist"],
    execute
  });

  return null;
}

function ActionCount() {
  const actions = useActions();
  return <output aria-label="action-count">{actions.length}</output>;
}

function PaletteProbe() {
  const { actions, open, query, openPalette, setQuery } = useCommandPalette();

  return (
    <div>
      <button type="button" onClick={openPalette}>
        Open
      </button>
      <button type="button" onClick={() => setQuery("persist")}>
        Search
      </button>
      <output aria-label="palette-open">{String(open)}</output>
      <output aria-label="palette-query">{query}</output>
      <output aria-label="palette-results">{actions.map((action) => action.id).join(",")}</output>
    </div>
  );
}

function ShortcutProbe() {
  const { getEffectiveShortcut, setShortcutOverride, clearShortcutOverride } = useShortcutBindings();

  return (
    <div>
      <button type="button" onClick={() => setShortcutOverride("save", "shift+s")}>
        Override
      </button>
      <button type="button" onClick={() => clearShortcutOverride("save")}>
        Clear
      </button>
      <output aria-label="effective-shortcut">{getEffectiveShortcut("save")}</output>
    </div>
  );
}

describe("ActionKitProvider", () => {
  it("registers mounted actions and removes them on unmount", async () => {
    const execute = vi.fn();
    const { unmount } = render(
      <ActionKitProvider>
        <RegisteredSaveAction execute={execute} />
        <ActionCount />
      </ActionKitProvider>
    );

    expect((await screen.findByLabelText("action-count")).textContent).toBe("1");

    unmount();
  });

  it("executes a matching shortcut and prevents the browser default", async () => {
    const execute = vi.fn();

    render(
      <ActionKitProvider>
        <RegisteredSaveAction execute={execute} />
        <ActionCount />
      </ActionKitProvider>
    );

    await waitFor(() => expect(screen.getByLabelText("action-count").textContent).toBe("1"));

    const prevented = !fireEvent.keyDown(window, { key: "s", ctrlKey: true });
    expect(execute).toHaveBeenCalledTimes(1);
    expect(prevented).toBe(true);
  });

  it("ignores shortcut events from editable elements by default", () => {
    const execute = vi.fn();

    render(
      <ActionKitProvider>
        <RegisteredSaveAction execute={execute} />
        <input aria-label="editor" />
      </ActionKitProvider>
    );

    fireEvent.keyDown(screen.getByLabelText("editor"), { key: "s", ctrlKey: true });
    expect(execute).not.toHaveBeenCalled();
  });

  it("exposes command palette state and search results", () => {
    render(
      <ActionKitProvider>
        <RegisteredSaveAction execute={vi.fn()} />
        <PaletteProbe />
      </ActionKitProvider>
    );

    fireEvent.click(screen.getByText("Open"));
    fireEvent.click(screen.getByText("Search"));

    expect(screen.getByLabelText("palette-open").textContent).toBe("true");
    expect(screen.getByLabelText("palette-query").textContent).toBe("persist");
    expect(screen.getByLabelText("palette-results").textContent).toBe("save");
  });

  it("persists shortcut overrides through configured storage", async () => {
    const savedOverrides: string[] = [];
    const storage: ActionKitStorage = {
      loadShortcutOverrides: () => ({ save: "alt+s" }),
      saveShortcutOverrides: (overrides) => {
        savedOverrides.push(JSON.stringify(overrides));
      }
    };

    render(
      <ActionKitProvider storage={storage}>
        <RegisteredSaveAction execute={vi.fn()} />
        <ShortcutProbe />
      </ActionKitProvider>
    );

    await waitFor(() => expect(screen.getByLabelText("effective-shortcut").textContent).toBe("alt+s"));

    fireEvent.click(screen.getByText("Override"));
    expect(screen.getByLabelText("effective-shortcut").textContent).toBe("shift+s");
    expect(savedOverrides[savedOverrides.length - 1]).toBe(JSON.stringify({ save: "shift+s" }));

    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByLabelText("effective-shortcut").textContent).toBe("mod+s");
  });

  it("provides a localStorage adapter", () => {
    const valuesByKey = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => valuesByKey.get(key) ?? null,
        setItem: (key: string, value: string) => valuesByKey.set(key, value)
      }
    });
    const adapter = createLocalStorageAdapter("actionkit:test");
    adapter.saveShortcutOverrides({ save: "shift+s" });

    expect(adapter.loadShortcutOverrides()).toEqual({ save: "shift+s" });
  });
});
