import type { Todo } from "../typescript/interface";
import { seededData } from "../data/fake-data";

export function loadTodos(storageKey: string): Todo[] {
  // Check whether run server or browser
  if (typeof window === "undefined") return seededData;

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return seededData;

    const parsed = JSON.parse(stored) as Array<Partial<Todo>>;
    if (!Array.isArray(parsed)) return seededData;

    const fallbackTime = Date.now();

    const sanitized: Todo[] = parsed
      .filter(
        (todo): todo is Partial<Todo> & Required<Pick<Todo, "text">> =>
          typeof todo === "object" &&
          todo !== null &&
          typeof todo.text === "string",
      )
      .map((todo, index) => ({
        id: typeof todo.id === "number" ? todo.id : fallbackTime + index,
        text: todo.text.trim(),
        completed: Boolean(todo.completed),
        createdAt:
          typeof todo.createdAt === "number"
            ? todo.createdAt
            : fallbackTime + index,
        priority:
          todo.priority === "low" ||
          todo.priority === "medium" ||
          todo.priority === "high"
            ? todo.priority
            : "low", // fallback
      }))
      .filter((todo) => todo.text.length > 0);

    return sanitized.length > 0 ? sanitized : seededData;
  } catch {
    return seededData;
  }
}
