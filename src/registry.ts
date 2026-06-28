import type { ActionDefinition, RegisteredAction } from "./types";

export class ActionRegistry {
  private readonly actionsById = new Map<string, RegisteredAction>();

  register(action: ActionDefinition): () => void {
    const registeredAction = normalizeAction(action);
    this.actionsById.set(registeredAction.id, registeredAction);

    return () => {
      const currentAction = this.actionsById.get(registeredAction.id);

      if (currentAction !== registeredAction) {
        return;
      }

      this.actionsById.delete(registeredAction.id);
    };
  }

  get(actionId: string): RegisteredAction | undefined {
    return this.actionsById.get(actionId);
  }

  getAll(): RegisteredAction[] {
    return Array.from(this.actionsById.values());
  }

  async execute(actionId: string): Promise<boolean> {
    const action = this.actionsById.get(actionId);

    if (!action || action.disabled) {
      return false;
    }

    await action.execute();
    return true;
  }
}

export function isVisibleAction(action: RegisteredAction): boolean {
  return !action.hidden;
}

function normalizeAction(action: ActionDefinition): RegisteredAction {
  return {
    ...action,
    keywords: action.keywords ? [...action.keywords] : undefined
  };
}
