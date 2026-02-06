import { useMemo } from "react";
import { type ButtonConfig, type Todo, type todoFilter  } from "./typescript/interface";
import Button from "./components/Button";
import { useTodos } from "./hook/useTodos";
import { useFilterTodo } from "./hook/useFilterTodo";
import TodoItem from "./components/TodoItem";
import FormComponent from "./components/FormComponent";
import TodoTable from "./components/TodoTable";
import { Margin, usePDF } from "react-to-pdf";


 const STORAGE_KEY = "react-play:simple-todo-app";
 const FILTER_KEY = `${STORAGE_KEY}:filter`;
 const PRIORITY_KEY = `${STORAGE_KEY}:priority`;
function App() {
  //useTodo hook
  const {
    todos,
    addTodo,
    setCompleteTodo,
    updateTodoText,
    deleteTodo,
    clearAll,
    clearCompleted,
    toggleAll,
  } = useTodos(STORAGE_KEY);

  const { priorityFilter, setPriorityFilter, filter, setFilter, resetFilters } =
    useFilterTodo(FILTER_KEY, PRIORITY_KEY);

     const { toPDF, targetRef } = usePDF({
        filename: 'use-pdf-example.pdf',
        page: { margin: Margin.MEDIUM, orientation: 'landscape' },
      });
  /**
   * FilteredTodos
   * Filters the todos array based on the filter and createdAt.
   * If the filter is "all", sorts by completed status first, then by createdAt.
   * If the filter is not "all", sorts only by createdAt.
   */
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const statusMatch =
        filter === "all"
          ? true
          : filter === "active"
            ? !todo.completed
            : todo.completed;

      const priorityMatch =
        priorityFilter === "all" ? true : todo.priority === priorityFilter;

      return statusMatch && priorityMatch;
    });
  }, [todos, filter, priorityFilter]);

  /**
   * SortedTodos
   * Sorts the filtered todos array based on the filter and createdAt.
   * If the filter is "all", sorts by completed status first, then by createdAt.
   * If the filter is not "all", sorts only by createdAt.
   */
  const sortedTodos = useMemo(() => {
    return [...filteredTodos].sort((a, b) => {
      if (filter === "all" && a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return b.createdAt - a.createdAt;
    });
  }, [filteredTodos, filter]);

  //Todos Count
  const remainingTodos = todos.filter((todo) => !todo.completed).length;
  const completedTodos = todos.length - remainingTodos;
  const completionRate =
    todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;
  const hasTodos = todos.length > 0;
  const hasCompletedTodos = completedTodos > 0;
  const allCompletd = hasTodos && remainingTodos === 0;


  /**
   * An array of button config objects.
   * Each object represents a button with a type, label, value, and optionally an onClick function and a disabled boolean.
   */
  const buttons: ButtonConfig[] = [
  // Actions
  {
    type: "action",
    label: allCompletd ? "Mark all active" : "Mark all complete",
    onClick: () => toggleAll(!allCompletd),
    disabled: !hasTodos,
  },
  {
    type: "action",
    label: "Clear completed",
    onClick: clearCompleted,
    disabled: !hasCompletedTodos,
  },
  {
    type: "action",
    label: "Clear all",
    onClick: clearAll,
    disabled: !hasTodos,
  },
  {
    type: "action",
    label: "Reset Filters",
    onClick: resetFilters,
    className: "bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-sm",
  },
];



  return (
    <section
      className="p-4 flex flex-col justify-center items-center my-5"
      aria-label="Todo list app"
    >
      {/* heading */}
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl">Simple Todo App</h2>
        <p>
          Track what needs to be tackled next. Add todos, toggle their
          completion state, edit existing items, and quickly clear the finished
          work.
        </p>
      </div>

      <div className="max-w-181 mx-auto my-6 rounded-xl p-6 bg-linear-to-r from-gray-200 to-zinc-100 text-black">
        {/* Form component */}
       <FormComponent onSubmit={addTodo}/>
        {/* To - Do toolbar */}
        <div className="pt-4 flex flex-col gap-4.5">

          {/* component */}
          <p className="flex items-center gap-2">
            <span>
              {completionRate === 100
                ? "No task left"
                : `${remainingTodos} ${remainingTodos === 1 ? "task" : "tasks"} left`}
            </span>
            {hasTodos && (
              <span className="bg-indigo-300 rounded-2xl px-2 py-0.5 font-semibold">
                {completionRate}% complete
              </span>
            )}
          </p>
            {/* FIlter by select dropdown */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <select
                className="flex-1 bg-indigo-200 px-2 py-4 rounded-sm focus:outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value as todoFilter)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="completed">completed</option>
                </select>
                <select
                  className="flex-1 bg-indigo-200 px-2 py-4 rounded-sm focus:outline-none"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as Todo["priority"])}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
            </div>
            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {buttons.map((button, index) => {
                return (
                  <Button
                    key={index}
                    onClick={button.onClick}
                    disabled={button.disabled}
                    ariaDisabled={button.disabled}
                    className={button.className}
                  >
                    {button.label}
                  </Button>
                  );
                })}
            </div>

          </div>
          {/* Show list of todo items */}
          <ul className="flex flex-col gap-5">
            {sortedTodos.length === 0 && (
              <li className="px-4 py-3 bg-indigo-100 text-center font-semibold">
                Nothing to show here yet.
              </li>
            )}
            {sortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleTodo={setCompleteTodo}
                updateTodo={updateTodoText}
                deleteTodo={deleteTodo}
              />
            ))}
          </ul>
        </div>
      </div>
      {/* Generate PDF */}
      <div>
        <button className="px-3 py-2 border-none bg-red-400 cursor-pointer rounded-sm" onClick={() => toPDF()}>Generate PDF</button>
      <div  ref={targetRef}
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1200px",
              padding: "24px",
              background: "white",
              color: "#000000",
              textAlign: "left",
            }}>
        <TodoTable todos= {todos}/>
      </div>
      </div>
    </section>
  );
}

export default App;
