import type { Todo, todoFilter } from "../typescript/interface";
//all, active, completed filter optiom
export const getInitialFilter = (storageKey: string): todoFilter => {
  if (typeof window === "undefined") return "all";
  const stored = window.localStorage.getItem(storageKey);


  if (stored === "all" || stored === "active" || stored === "completed") {
    return stored as todoFilter;
  }

  return "all"; 
};

// utils/loadTodos Priority Filter


export const getInitialPriority = (storageKey: string): Todo["priority"] | "all" => {
  if (typeof window === "undefined") return "all";
  const stored = window.localStorage.getItem(storageKey);

  if (stored === "low" || stored === "medium" || stored === "high" || stored === "all") {
    return stored as Todo["priority"] | "all";
  }

  return "all"; 
};



