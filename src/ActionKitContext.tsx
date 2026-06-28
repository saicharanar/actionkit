import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { ActionRegistry } from "./registry";
import { searchActions } from "./search";
import {
  findActionForKeyboardEvent,
  getEffectiveShortcut as resolveEffectiveShortcut,
  normalizeShortcut,
  shortcutConflicts,
  shouldIgnoreKeyboardTarget
} from "./shortcuts";
import type { ActionDefinition, ActionKitContextValue, ActionKitProviderProps, RegisteredAction, ShortcutOverrides } from "./types";

const ActionKitContext = createContext<ActionKitContextValue | null>(null);

export function ActionKitProvider({ children, storage, ignoreEditableElements = true }: ActionKitProviderProps) {
  const registryRef = useRef(new ActionRegistry());
  const [actions, setActions] = useState<RegisteredAction[]>([]);
  const [shortcutOverrides, setShortcutOverrides] = useState<ShortcutOverrides>({});
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOverrides() {
      const loadedOverrides = await storage?.loadShortcutOverrides();

      if (!active || !loadedOverrides) {
        return;
      }

      setShortcutOverrides(loadedOverrides);
    }

    void loadOverrides();

    return () => {
      active = false;
    };
  }, [storage]);

  const syncActions = useCallback(() => {
    setActions(registryRef.current.getAll());
  }, []);

  const registerAction = useCallback(
    (action: ActionDefinition) => {
      const unregister = registryRef.current.register(action);
      syncActions();

      return () => {
        unregister();
        syncActions();
      };
    },
    [syncActions]
  );

  const executeAction = useCallback(async (actionId: string) => registryRef.current.execute(actionId), []);

  const getAction = useCallback((actionId: string) => registryRef.current.get(actionId), []);

  const getEffectiveShortcut = useCallback(
    (actionId: string) => {
      const action = registryRef.current.get(actionId);
      return action ? resolveEffectiveShortcut(action, shortcutOverrides) : undefined;
    },
    [shortcutOverrides]
  );

  const persistShortcutOverrides = useCallback(
    (nextOverrides: ShortcutOverrides) => {
      setShortcutOverrides(nextOverrides);
      void storage?.saveShortcutOverrides(nextOverrides);
    },
    [storage]
  );

  const setShortcutOverride = useCallback(
    (actionId: string, shortcut: string) => {
      const normalizedShortcut = normalizeShortcut(shortcut);

      if (shortcutConflicts(actionId, normalizedShortcut, registryRef.current.getAll(), shortcutOverrides)) {
        return false;
      }

      persistShortcutOverrides({
        ...shortcutOverrides,
        [actionId]: normalizedShortcut
      });

      return true;
    },
    [persistShortcutOverrides, shortcutOverrides]
  );

  const clearShortcutOverride = useCallback(
    (actionId: string) => {
      const nextOverrides = { ...shortcutOverrides };
      delete nextOverrides[actionId];
      persistShortcutOverrides(nextOverrides);
    },
    [persistShortcutOverrides, shortcutOverrides]
  );

  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const togglePalette = useCallback(() => setPaletteOpen((currentValue) => !currentValue), []);
  const paletteActions = useMemo(() => searchActions(actions, paletteQuery), [actions, paletteQuery]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (ignoreEditableElements && shouldIgnoreKeyboardTarget(event.target)) {
        return;
      }

      const action = findActionForKeyboardEvent(event, registryRef.current.getAll(), shortcutOverrides);

      if (!action) {
        return;
      }

      event.preventDefault();
      void registryRef.current.execute(action.id);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ignoreEditableElements, shortcutOverrides]);

  const value = useMemo<ActionKitContextValue>(
    () => ({
      actions,
      shortcutOverrides,
      registerAction,
      executeAction,
      getAction,
      getEffectiveShortcut,
      setShortcutOverride,
      clearShortcutOverride,
      paletteOpen,
      paletteQuery,
      paletteActions,
      openPalette,
      closePalette,
      togglePalette,
      setPaletteQuery
    }),
    [
      actions,
      clearShortcutOverride,
      closePalette,
      executeAction,
      getAction,
      getEffectiveShortcut,
      openPalette,
      paletteActions,
      paletteOpen,
      paletteQuery,
      registerAction,
      setShortcutOverride,
      shortcutOverrides,
      togglePalette
    ]
  );

  return <ActionKitContext.Provider value={value}>{children}</ActionKitContext.Provider>;
}

export function useActionKitContext(): ActionKitContextValue {
  const context = useContext(ActionKitContext);

  if (!context) {
    throw new Error("ActionKit hooks must be used inside ActionKitProvider.");
  }

  return context;
}
