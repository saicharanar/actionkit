import type { ActionKitStorage, ShortcutOverrides } from "./types";

const DEFAULT_STORAGE_KEY = "actionkit:shortcut-overrides";

export function createLocalStorageAdapter(storageKey = DEFAULT_STORAGE_KEY): ActionKitStorage {
  return {
    loadShortcutOverrides() {
      if (!hasLocalStorage()) {
        return {};
      }

      const rawValue = window.localStorage.getItem(storageKey);
      return rawValue ? parseShortcutOverrides(rawValue) : {};
    },
    saveShortcutOverrides(overrides) {
      if (!hasLocalStorage()) {
        return;
      }

      window.localStorage.setItem(storageKey, JSON.stringify(overrides));
    }
  };
}

function parseShortcutOverrides(rawValue: string): ShortcutOverrides {
  try {
    const parsedValue = JSON.parse(rawValue);
    return isShortcutOverrides(parsedValue) ? parsedValue : {};
  } catch {
    return {};
  }
}

function isShortcutOverrides(value: unknown): value is ShortcutOverrides {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((shortcut) => shortcut === undefined || typeof shortcut === "string");
}

function hasLocalStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    Boolean(window.localStorage) &&
    typeof window.localStorage.getItem === "function" &&
    typeof window.localStorage.setItem === "function"
  );
}
