# ActionKit

ActionKit is a small headless React library for centralized application actions, keyboard shortcuts, and command palette state.

Register an action once, then expose it through shortcuts, search, settings, menus, or any UI you build yourself.

```tsx
import { ActionKitProvider, useRegisterAction } from "react-actionkit";

function SaveAction() {
  useRegisterAction({
    id: "save-document",
    title: "Save Document",
    description: "Save the current document",
    shortcut: "mod+s",
    execute: saveDocument
  });

  return null;
}

export function App() {
  return (
    <ActionKitProvider>
      <SaveAction />
    </ActionKitProvider>
  );
}
```

ActionKit ships no styled UI. Build your own command palette with `useCommandPalette`, render actions however you like, and keep business logic registered once.

## Install

```sh
npm install react-actionkit
```

React and React DOM are peer dependencies.

## Core API

```tsx
import {
  ActionKitProvider,
  createLocalStorageAdapter,
  useCommandPalette,
  useRegisterAction,
  useShortcutBindings
} from "react-actionkit";
```

### Provider

```tsx
const shortcutStorage = createLocalStorageAdapter("my-app:shortcuts");

export function Root() {
  return (
    <ActionKitProvider storage={shortcutStorage}>
      <App />
    </ActionKitProvider>
  );
}
```

### Custom Command Palette

```tsx
function CommandPalette() {
  const { actions, closePalette, executeAction, open, query, setQuery } = useCommandPalette();

  if (!open) {
    return null;
  }

  return (
    <div role="dialog" aria-modal="true">
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={async () => {
            await executeAction(action.id);
            closePalette();
          }}
        >
          {action.title}
        </button>
      ))}
    </div>
  );
}
```

### Shortcut Settings

```tsx
function ShortcutSettings() {
  const { clearShortcutOverride, getEffectiveShortcut, setShortcutOverride } = useShortcutBindings();

  return (
    <section>
      <p>Save draft: {getEffectiveShortcut("save-draft")}</p>
      <button type="button" onClick={() => setShortcutOverride("save-draft", "alt+s")}>
        Use Alt+S
      </button>
      <button type="button" onClick={() => clearShortcutOverride("save-draft")}>
        Reset
      </button>
    </section>
  );
}
```

## Demo

```sh
npm install
npm run demo
```

Then open `http://localhost:5173`.

The demo is intentionally styled in the example app only. The library does not ship CSS or visual components.
