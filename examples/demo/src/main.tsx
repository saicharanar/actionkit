import { StrictMode, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ActionKitProvider, createLocalStorageAdapter } from "actionkit";
import { ActivityFeed } from "./ActivityFeed";
import { AppHeader } from "./AppHeader";
import { CommandPaletteOverlay } from "./CommandPaletteOverlay";
import { initialActivity, initialRequest } from "./demoData";
import { RequestForm } from "./RequestForm";
import { CollapsedPreview, RequestPreview } from "./RequestPreview";
import { ShortcutPanel } from "./ShortcutPanel";
import { WorkspaceActions } from "./WorkspaceActions";
import type { ActivityItem, LaunchRequest } from "./demoTypes";
import "./styles.css";

function DemoApp() {
  const storage = useMemo(() => createLocalStorageAdapter("actionkit:demo-shortcuts"), []);

  return (
    <ActionKitProvider storage={storage} ignoreEditableElements={false}>
      <LaunchRequestWorkspace />
    </ActionKitProvider>
  );
}

function LaunchRequestWorkspace() {
  const [request, setRequest] = useState<LaunchRequest>(initialRequest);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);
  const titleRef = useRef<HTMLInputElement>(null);
  const ownerRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  function updateRequest(field: keyof LaunchRequest, value: string) {
    setRequest((currentRequest) => ({
      ...currentRequest,
      [field]: value
    }));
  }

  function recordActivity(label: string) {
    setActivity((currentActivity) => [{ id: Date.now(), label }, ...currentActivity].slice(0, 6));
  }

  function resetRequest() {
    setRequest(initialRequest);
    recordActivity("Form reset to the original launch request");
  }

  function saveDraft() {
    recordActivity(`Draft saved: ${request.title}`);
  }

  function submitRequest() {
    recordActivity(`Launch request submitted for ${request.owner}`);
  }

  function togglePreview() {
    setPreviewOpen((currentValue) => !currentValue);
    recordActivity("Preview visibility changed");
  }

  return (
    <>
      <WorkspaceActions
        fieldRefs={{ title: titleRef, owner: ownerRef, summary: summaryRef }}
        resetRequest={resetRequest}
        saveDraft={saveDraft}
        submitRequest={submitRequest}
        togglePreview={togglePreview}
      />
      <main className="appShell">
        <AppHeader />
        <section className="workspaceGrid">
          <RequestForm
            ownerRef={ownerRef}
            request={request}
            summaryRef={summaryRef}
            titleRef={titleRef}
            updateRequest={updateRequest}
          />
          <aside className="sideRail">
            {previewOpen ? <RequestPreview request={request} /> : <CollapsedPreview />}
            <ShortcutPanel />
            <ActivityFeed activity={activity} />
          </aside>
        </section>
      </main>
      <CommandPaletteOverlay />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DemoApp />
  </StrictMode>
);
