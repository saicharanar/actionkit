import type { LaunchRequest } from "./demoTypes";

export function RequestPreview({ request }: { request: LaunchRequest }) {
  return (
    <section className="panel previewPanel">
      <div className="surfaceHeader compactHeader">
        <div>
          <p className="surfaceLabel">Preview</p>
          <h2>Review packet</h2>
        </div>
        <span className={`priorityBadge ${request.priority.toLowerCase()}`}>{request.priority}</span>
      </div>
      <dl className="previewList">
        <div>
          <dt>Title</dt>
          <dd>{request.title || "Untitled request"}</dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd>{request.owner || "Unassigned"}</dd>
        </div>
        <div>
          <dt>Target</dt>
          <dd>{request.targetDate || "No date"}</dd>
        </div>
        <div>
          <dt>Summary</dt>
          <dd>{request.summary || "No summary"}</dd>
        </div>
      </dl>
    </section>
  );
}

export function CollapsedPreview() {
  return (
    <section className="panel collapsedPanel">
      <p className="surfaceLabel">Preview</p>
      <h2>Hidden</h2>
    </section>
  );
}
