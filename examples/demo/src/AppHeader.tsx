import { useCommandPalette } from "actionkit";

export function AppHeader() {
  const { openPalette } = useCommandPalette();

  return (
    <header className="appHeader">
      <div>
        <p className="eyebrow">Launch ops</p>
        <h1>Project intake</h1>
      </div>
      <button className="commandButton" type="button" onClick={openPalette}>
        Command palette <kbd>Ctrl/Cmd K</kbd>
      </button>
    </header>
  );
}
