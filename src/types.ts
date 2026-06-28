import type { ReactNode } from "react";

export type ActionExecute = () => void | Promise<void>;

export interface ActionDefinition {
  id: string;
  title: string;
  description?: string;
  group?: string;
  keywords?: string[];
  shortcut?: string;
  disabled?: boolean;
  hidden?: boolean;
  execute: ActionExecute;
}

export interface RegisteredAction extends ActionDefinition {
  shortcut?: string;
}

export interface ShortcutOverrides {
  [actionId: string]: string | undefined;
}

export interface ActionKitStorage {
  loadShortcutOverrides: () => ShortcutOverrides | Promise<ShortcutOverrides>;
  saveShortcutOverrides: (overrides: ShortcutOverrides) => void | Promise<void>;
}

export interface ActionKitProviderProps {
  children: ReactNode;
  storage?: ActionKitStorage;
  ignoreEditableElements?: boolean;
}

export interface ActionKitContextValue {
  actions: RegisteredAction[];
  shortcutOverrides: ShortcutOverrides;
  registerAction: (action: ActionDefinition) => () => void;
  executeAction: (actionId: string) => Promise<boolean>;
  getAction: (actionId: string) => RegisteredAction | undefined;
  getEffectiveShortcut: (actionId: string) => string | undefined;
  setShortcutOverride: (actionId: string, shortcut: string) => boolean;
  clearShortcutOverride: (actionId: string) => void;
  paletteOpen: boolean;
  paletteQuery: string;
  paletteActions: RegisteredAction[];
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  setPaletteQuery: (query: string) => void;
}
