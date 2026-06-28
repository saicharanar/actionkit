import { isVisibleAction } from "./registry";
import type { RegisteredAction } from "./types";

interface ScoredAction {
  action: RegisteredAction;
  score: number;
}

export function searchActions(actions: RegisteredAction[], query: string): RegisteredAction[] {
  const visibleActions = actions.filter(isVisibleAction);
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return sortActions(visibleActions);
  }

  return visibleActions
    .map((action) => ({ action, score: scoreAction(action, normalizedQuery) }))
    .filter((scoredAction) => scoredAction.score > 0)
    .sort(compareScoredActions)
    .map((scoredAction) => scoredAction.action);
}

function scoreAction(action: RegisteredAction, normalizedQuery: string): number {
  const title = normalizeSearchText(action.title);
  const description = normalizeSearchText(action.description);
  const group = normalizeSearchText(action.group);
  const keywordText = normalizeSearchText(action.keywords?.join(" "));

  return (
    scoreField(title, normalizedQuery, 1000, 700, 500) +
    scoreField(keywordText, normalizedQuery, 650, 450, 300) +
    scoreField(group, normalizedQuery, 400, 275, 175) +
    scoreField(description, normalizedQuery, 250, 175, 100)
  );
}

function scoreField(text: string, query: string, exactScore: number, prefixScore: number, includesScore: number): number {
  if (!text) {
    return 0;
  }

  if (text === query) {
    return exactScore;
  }

  if (text.startsWith(query)) {
    return prefixScore;
  }

  if (text.includes(query)) {
    return includesScore;
  }

  return isSubsequence(query, text) ? Math.floor(includesScore / 2) : 0;
}

function compareScoredActions(first: ScoredAction, second: ScoredAction): number {
  if (second.score !== first.score) {
    return second.score - first.score;
  }

  return first.action.title.localeCompare(second.action.title);
}

function sortActions(actions: RegisteredAction[]): RegisteredAction[] {
  return [...actions].sort((first, second) => first.title.localeCompare(second.title));
}

function normalizeSearchText(text?: string): string {
  return text?.trim().toLowerCase() ?? "";
}

function isSubsequence(query: string, text: string): boolean {
  let queryIndex = 0;

  for (const character of text) {
    if (character === query[queryIndex]) {
      queryIndex += 1;
    }

    if (queryIndex === query.length) {
      return true;
    }
  }

  return false;
}
