import type { Todo, todoFilter } from "../typescript/interface";

/**
 * Returns the initial filter value from local storage.
 * If no value is found, or if the value is not "all", "active", or "completed", returns "all".
 */
export const getInitialFilter = (storageKey: string): todoFilter => {
  if (typeof window === "undefined") return "all";
  const stored = window.localStorage.getItem(storageKey);


  if (stored === "all" || stored === "active" || stored === "completed") {
    return stored as todoFilter;
  }

  return "all"; 
};



/**
 * Returns the initial priority value from local storage.
 * If no value is found, or if the value is not "low", "medium", "high" initially returns "all".
 */
export const getInitialPriority = (storageKey: string): Todo["priority"] | "all" => {
  if (typeof window === "undefined") return "all";
  const stored = window.localStorage.getItem(storageKey);

  if (stored === "low" || stored === "medium" || stored === "high" || stored === "all") {
    return stored as Todo["priority"] | "all";
  }

  return "all"; 
};



