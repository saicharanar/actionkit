import { useActions, useShortcutBindings } from "react-actionkit";

export function ShortcutPanel() {
  const actions = useActions();
  const { clearShortcutOverride, getEffectiveShortcut, setShortcutOverride } = useShortcutBindings();

  function overrideShortcut(actionId: string, index: number) {
    setShortcutOverride(actionId, `alt+${index + 1}`);
  }

  return (
    <section className="panel">
      <div className="surfaceHeader compactHeader">
        <div>
          <p className="surfaceLabel">Bindings</p>
          <h2>Shortcuts</h2>
        </div>
      </div>
      <div className="shortcutList">
        {actions.map((action, index) => (
          <div className="shortcutRow" key={action.id}>
            <span>{action.title}</span>
            <kbd>{getEffectiveShortcut(action.id) ?? "None"}</kbd>
            <button type="button" onClick={() => overrideShortcut(action.id, index)}>
              Alt {index + 1}
            </button>
            <button type="button" onClick={() => clearShortcutOverride(action.id)}>
              Clear
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
