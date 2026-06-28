import { useEffect, useMemo, useRef } from "react";
import { searchActions } from "./search";
import { useActionKitContext } from "./ActionKitContext";
import type { ActionDefinition, RegisteredAction } from "./types";

export function useRegisterAction(action: ActionDefinition): void {
  const { registerAction } = useActionKitContext();
  const actionRef = useRef(action);
  const dependencyKey = createActionDependencyKey(action);

  actionRef.current = action;

  useEffect(
    () =>
      registerAction({
        ...action,
        execute: () => actionRef.current.execute()
      }),
    [dependencyKey, registerAction]
  );
}

export function useAction(actionId: string): RegisteredAction | undefined {
  const { actions } = useActionKitContext();
  return useMemo(() => actions.find((action) => action.id === actionId), [actionId, actions]);
}

export function useActions(): RegisteredAction[] {
  const { actions } = useActionKitContext();
  return actions;
}

export function useCommandPalette() {
  const {
    paletteOpen,
    paletteQuery,
    paletteActions,
    openPalette,
    closePalette,
    togglePalette,
    setPaletteQuery,
    executeAction
  } = useActionKitContext();

  return {
    open: paletteOpen,
    query: paletteQuery,
    actions: paletteActions,
    openPalette,
    closePalette,
    togglePalette,
    setQuery: setPaletteQuery,
    executeAction
  };
}

export function useShortcutBindings() {
  const { shortcutOverrides, getEffectiveShortcut, setShortcutOverride, clearShortcutOverride } = useActionKitContext();

  return {
    shortcutOverrides,
    getEffectiveShortcut,
    setShortcutOverride,
    clearShortcutOverride
  };
}

export function useFilteredActions(query: string) {
  const { actions } = useActionKitContext();
  return useMemo(() => searchActions(actions, query), [actions, query]);
}

function createActionDependencyKey(action: ActionDefinition): string {
  return JSON.stringify({
    id: action.id,
    title: action.title,
    description: action.description,
    group: action.group,
    keywords: action.keywords,
    shortcut: action.shortcut,
    disabled: action.disabled,
    hidden: action.hidden
  });
}
