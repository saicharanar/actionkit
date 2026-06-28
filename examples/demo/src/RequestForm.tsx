import type { RefObject } from "react";
import type { LaunchRequest } from "./demoTypes";

interface RequestFormProps {
  ownerRef: RefObject<HTMLInputElement | null>;
  request: LaunchRequest;
  summaryRef: RefObject<HTMLTextAreaElement | null>;
  titleRef: RefObject<HTMLInputElement | null>;
  updateRequest: (field: keyof LaunchRequest, value: string) => void;
}

export function RequestForm({ ownerRef, request, summaryRef, titleRef, updateRequest }: RequestFormProps) {
  return (
    <section className="formSurface">
      <div className="surfaceHeader">
        <div>
          <p className="surfaceLabel">Request form</p>
          <h2>{request.title || "Untitled request"}</h2>
        </div>
        <span className={`priorityBadge ${request.priority.toLowerCase()}`}>{request.priority}</span>
      </div>

      <form className="requestForm">
        <label>
          <span>Title</span>
          <input
            ref={titleRef}
            value={request.title}
            onChange={(event) => updateRequest("title", event.target.value)}
          />
        </label>

        <div className="fieldPair">
          <label>
            <span>Owner</span>
            <input
              ref={ownerRef}
              value={request.owner}
              onChange={(event) => updateRequest("owner", event.target.value)}
            />
          </label>
          <label>
            <span>Priority</span>
            <select value={request.priority} onChange={(event) => updateRequest("priority", event.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
        </div>

        <label>
          <span>Target date</span>
          <input
            type="date"
            value={request.targetDate}
            onChange={(event) => updateRequest("targetDate", event.target.value)}
          />
        </label>

        <label>
          <span>Summary</span>
          <textarea
            ref={summaryRef}
            value={request.summary}
            onChange={(event) => updateRequest("summary", event.target.value)}
          />
        </label>
      </form>
    </section>
  );
}
