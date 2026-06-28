import type { ActivityItem } from "./demoTypes";

export function ActivityFeed({ activity }: { activity: ActivityItem[] }) {
  return (
    <section className="panel">
      <div className="surfaceHeader compactHeader">
        <div>
          <p className="surfaceLabel">Activity</p>
          <h2>Workspace log</h2>
        </div>
      </div>
      <ul className="activityList">
        {activity.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </section>
  );
}
