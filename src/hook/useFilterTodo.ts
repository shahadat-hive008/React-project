import { useEffect, useState } from "react";
import type { Todo, todoFilter } from "../typescript/interface";
import { getInitialFilter, getInitialPriority } from "../utils/loadTodosFilter";

/**
 * useFilterTodo hook
 * @param {string} filterKey - key to save filter state in local storage
 * @param {string} priorityKey - key to save priority state in local storage
 * @returns {object} - object containing priorityFilter, setPriorityFilter, filter, setFilter, resetFilters
 * @property {Todo["priority"] | "all"} priorityFilter - current priority filter
 * @property {(priority: Todo["priority"] | "all") => void} setPriorityFilter - function to set priority filter
 * @property {todoFilter} filter - current filter
 * @property {(filter: todoFilter) => void} setFilter - function to set filter
 * @property {() => void} resetFilters - function to reset filter and priority to default
 */
export function useFilterTodo(filterKey: string, priorityKey: string) {
  //Todos Priority
  const [priorityFilter, setPriorityFilter] = useState<Todo["priority"] | "all">(() => getInitialPriority(priorityKey));
  //Todos filter State
  const [filter, setFilter] = useState<todoFilter>(() =>
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
