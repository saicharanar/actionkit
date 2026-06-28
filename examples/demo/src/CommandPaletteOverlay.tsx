import { useState, type KeyboardEvent } from "react";
import { useCommandPalette, useShortcutBindings } from "actionkit";

export function CommandPaletteOverlay() {
  const { actions, closePalette, executeAction, open, query, setQuery } = useCommandPalette();
  const { getEffectiveShortcut } = useShortcutBindings();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedAction = actions[selectedIndex] ?? actions[0];

  if (!open) {
    return null;
  }

  async function runAction(actionId: string) {
    await executeAction(actionId);
    closePalette();
    setQuery("");
    setSelectedIndex(0);
  }

  function handlePaletteKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      closePalette();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((currentIndex) => (actions.length === 0 ? 0 : Math.min(currentIndex + 1, actions.length - 1)));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((currentIndex) => Math.max(currentIndex - 1, 0));
      return;
    }

    if (event.key === "Enter" && selectedAction) {
      event.preventDefault();
      void runAction(selectedAction.id);
    }
  }

  function updateQuery(value: string) {
    setQuery(value);
    setSelectedIndex(0);
  }

  return (
    <div className="paletteBackdrop" onMouseDown={closePalette}>
      <section className="commandPalette" onKeyDown={handlePaletteKeyDown} onMouseDown={(event) => event.stopPropagation()}>
        <div className="paletteInputRow">
          <input
            autoFocus
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Type a command or field name..."
          />
          <kbd>Esc</kbd>
        </div>

        <div className="paletteResults">
          {actions.length === 0 ? <div className="emptyResult">No matching commands</div> : null}
          {actions.map((action, index) => (
            <button
              className={index === selectedIndex ? "paletteItem selected" : "paletteItem"}
              key={action.id}
              type="button"
              onClick={() => void runAction(action.id)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span>
                <small>{action.group}</small>
                <strong>{action.title}</strong>
                <em>{action.description}</em>
              </span>
              <kbd>{getEffectiveShortcut(action.id) ?? ""}</kbd>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
