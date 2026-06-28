import { ActionKitProvider, useCommandPalette, useRegisterAction } from "actionkit";

function saveDocument() {
  // Replace this with application-specific save logic.
}

function DocumentActions() {
  useRegisterAction({
    id: "save-document",
    title: "Save Document",
    description: "Save the current document",
    shortcut: "mod+s",
    execute: saveDocument
  });

  return null;
}

function CommandPaletteDebug() {
  const { actions, query, setQuery } = useCommandPalette();

  return (
    <section>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actions" />
      <ul>
        {actions.map((action) => (
          <li key={action.id}>{action.title}</li>
        ))}
      </ul>
    </section>
  );
}

export function App() {
  return (
    <ActionKitProvider>
      <DocumentActions />
      <CommandPaletteDebug />
    </ActionKitProvider>
  );
}
