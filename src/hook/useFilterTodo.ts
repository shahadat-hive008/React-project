import { useEffect, useState } from "react";
import type { Todo, TodoFilter } from "../typescript/interface";
import { getInitialFilter, getInitialPriority } from "../utils/loadTodosFilter";

/**
 * useFilterTodo hook, managing todos filter and priority state and saving to local storage.
 * @Returns an object containing todos priority filter state, setPriorityFilter, todos filter state, setFilter, and resetFilters functions and todos filter state, setFilter, and resetFilters functions.
 */
export function useFilterTodo(filterKey: string, priorityKey: string) {
  //Todos Priority
  const [priorityFilter, setPriorityFilter] = useState<
    Todo["priority"] | "all"
  >(() => getInitialPriority(priorityKey));
  //Todos filter State
  const [filter, setFilter] = useState<TodoFilter>(() =>
    getInitialFilter(filterKey),
  );

  // save filter and priority in local storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(filterKey, filter);
    window.localStorage.setItem(priorityKey, priorityFilter);
    // URL params
    const url = new URL(window.location.href);
    url.searchParams.set("filter", filter);
    url.searchParams.set("priority", priorityFilter);
    window.history.replaceState({}, "", url.toString());
  }, [filter, priorityFilter]);

  //reset filter
  const resetFilters = () => {
    setFilter("all");
    setPriorityFilter("all");
    // Optional: remove from URL
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("filter");
      url.searchParams.delete("priority");
      window.history.replaceState({}, "", url.toString());
    }
  };
  return {
    priorityFilter,
    setPriorityFilter,
    filter,
    setFilter,
    resetFilters,
  };
}
