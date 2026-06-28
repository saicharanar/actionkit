import { useCommandPalette, useRegisterAction } from "react-actionkit";
import type { FieldRefs } from "./demoTypes";

interface WorkspaceActionsProps {
  fieldRefs: FieldRefs;
  resetRequest: () => void;
  saveDraft: () => void;
  submitRequest: () => void;
  togglePreview: () => void;
}

export function WorkspaceActions({
  fieldRefs,
  resetRequest,
  saveDraft,
  submitRequest,
  togglePreview
}: WorkspaceActionsProps) {
  const { closePalette, openPalette } = useCommandPalette();

  useRegisterAction({
    id: "open-command-palette",
    title: "Open Command Palette",
    description: "Search every available workspace action",
    group: "Navigation",
    keywords: ["commands", "quick switcher", "actions"],
    shortcut: "mod+k",
    execute: openPalette
  });

  useRegisterAction({
    id: "close-command-palette",
    title: "Close Command Palette",
    description: "Dismiss the command palette",
    group: "Navigation",
    keywords: ["escape", "dismiss"],
    shortcut: "escape",
    execute: closePalette
  });

  useRegisterAction({
    id: "save-draft",
    title: "Save Draft",
    description: "Save the current launch request",
    group: "Request",
    keywords: ["persist", "write", "store"],
    shortcut: "mod+s",
    execute: saveDraft
  });

  useRegisterAction({
    id: "submit-request",
    title: "Submit Request",
    description: "Send the launch request for review",
    group: "Request",
    keywords: ["send", "review", "publish"],
    shortcut: "mod+enter",
    execute: submitRequest
  });

  useRegisterAction({
    id: "reset-request",
    title: "Reset Request",
    description: "Restore the sample request data",
    group: "Request",
    keywords: ["clear", "restart"],
    shortcut: "mod+backspace",
    execute: resetRequest
  });

  useRegisterAction({
    id: "toggle-preview",
    title: "Toggle Preview",
    description: "Show or hide the request preview",
    group: "View",
    keywords: ["panel", "summary"],
    shortcut: "mod+shift+p",
    execute: togglePreview
  });

  useRegisterAction({
    id: "focus-title",
    title: "Focus Title",
    description: "Move focus to the title field",
    group: "Fields",
    keywords: ["name", "headline"],
    shortcut: "alt+t",
    execute: () => fieldRefs.title.current?.focus()
  });

  useRegisterAction({
    id: "focus-owner",
    title: "Focus Owner",
    description: "Move focus to the owner field",
    group: "Fields",
    keywords: ["assignee", "person"],
    shortcut: "alt+o",
    execute: () => fieldRefs.owner.current?.focus()
  });

  useRegisterAction({
    id: "focus-summary",
    title: "Focus Summary",
    description: "Move focus to the summary editor",
    group: "Fields",
    keywords: ["description", "notes"],
    shortcut: "alt+s",
    execute: () => fieldRefs.summary.current?.focus()
  });

  return null;
}
