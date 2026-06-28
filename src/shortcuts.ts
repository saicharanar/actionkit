import type { RegisteredAction, ShortcutOverrides } from "./types";

const MODIFIER_ORDER = ["mod", "ctrl", "meta", "alt", "shift"] as const;
const MODIFIER_ALIASES = new Map([
  ["cmd", "mod"],
  ["command", "mod"],
  ["option", "alt"],
  ["control", "ctrl"],
  ["esc", "escape"],
  ["return", "enter"],
  ["plus", "+"],
  ["space", " "]
]);

export function normalizeShortcut(shortcut: string): string {
  const tokens = shortcut
    .split("+")
    .map((token) => normalizeToken(token))
    .filter(Boolean);

  const modifiers = new Set(tokens.filter(isModifierToken));
  const key = tokens.find((token) => !isModifierToken(token));

  if (!key) {
    return Array.from(modifiers).sort(compareModifiers).join("+");
  }

  return [...Array.from(modifiers).sort(compareModifiers), key].join("+");
}

export function getEffectiveShortcut(action: RegisteredAction, shortcutOverrides: ShortcutOverrides): string | undefined {
  const override = shortcutOverrides[action.id];
  const shortcut = override ?? action.shortcut;
  return shortcut ? normalizeShortcut(shortcut) : undefined;
}

export function findActionForKeyboardEvent(
  event: KeyboardEvent,
  actions: RegisteredAction[],
  shortcutOverrides: ShortcutOverrides
): RegisteredAction | undefined {
  return actions.find((action) => {
    if (action.disabled || action.hidden) {
      return false;
    }

    const shortcut = getEffectiveShortcut(action, shortcutOverrides);
    return shortcut ? shortcutMatchesEvent(shortcut, event) : false;
  });
}

export function shortcutConflicts(
  actionId: string,
  shortcut: string,
  actions: RegisteredAction[],
  shortcutOverrides: ShortcutOverrides
): boolean {
  const normalizedShortcut = normalizeShortcut(shortcut);

  return actions.some((action) => {
    if (action.id === actionId) {
      return false;
    }

    const effectiveShortcut = getEffectiveShortcut(action, shortcutOverrides);
    return effectiveShortcut === normalizedShortcut;
  });
}

export function shouldIgnoreKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select";
}

export function shortcutMatchesEvent(shortcut: string, event: KeyboardEvent): boolean {
  const normalizedShortcut = normalizeShortcut(shortcut);
  const tokens = normalizedShortcut.split("+");
  const expectedKey = tokens.find((token) => !isModifierToken(token));
  const expectedModifiers = new Set(tokens.filter(isModifierToken));

  if (!expectedKey || expectedKey !== normalizeEventKey(event.key)) {
    return false;
  }

  return modifiersMatch(expectedModifiers, event);
}

function modifiersMatch(expectedModifiers: Set<string>, event: KeyboardEvent): boolean {
  const expectsMod = expectedModifiers.has("mod");
  const expectsCtrl = expectedModifiers.has("ctrl");
  const expectsMeta = expectedModifiers.has("meta");
  const usesApplePlatform = isApplePlatform();
  const platformModMatches = usesApplePlatform ? event.metaKey : event.ctrlKey;

  if (expectsMod && !platformModMatches) {
    return false;
  }

  if (!expectsMod && event.ctrlKey !== expectsCtrl) {
    return false;
  }

  if (!expectsMod && event.metaKey !== expectsMeta) {
    return false;
  }

  if (expectsMod && usesApplePlatform && event.ctrlKey !== expectsCtrl) {
    return false;
  }

  if (expectsMod && !usesApplePlatform && event.metaKey !== expectsMeta) {
    return false;
  }

  return event.altKey === expectedModifiers.has("alt") && event.shiftKey === expectedModifiers.has("shift");
}

function normalizeToken(token: string): string {
  const normalizedToken = token.trim().toLowerCase();
  return MODIFIER_ALIASES.get(normalizedToken) ?? normalizedToken;
}

function normalizeEventKey(key: string): string {
  return normalizeToken(key.length === 1 ? key.toLowerCase() : key);
}

function isModifierToken(token: string): boolean {
  return MODIFIER_ORDER.some((modifier) => modifier === token);
}

function compareModifiers(first: string, second: string): number {
  return modifierIndex(first) - modifierIndex(second);
}

function modifierIndex(modifier: string): number {
  const index = MODIFIER_ORDER.findIndex((orderedModifier) => orderedModifier === modifier);
  return index === -1 ? MODIFIER_ORDER.length : index;
}

function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") {
    return true;
  }

  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}
