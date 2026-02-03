import { useEffect, useRef, useState } from "react";
import { priorityBadgeClasses, type Todo, type todoFilter } from "./typescript/interface";
import { buttonCommonClasses, actionButtonClasses } from "./customStyle/style";
import Button from "./components/Button";
import { loadTodos } from "./utils/loadTodos";
import { getInitialFilter, getInitialPriority } from "./utils/loadTodosFilter";

const STORAGE_KEY = "react-play:simple-todo-app";
const FILTER_KEY = `${STORAGE_KEY}:filter`;
const PRIORITY_KEY = `${STORAGE_KEY}:priority`;

function App() {
  //Input text
  const [text, setText] = useState("");
  //Select text 
  const [priority, setPriority] = useState<Todo["priority"]>("low");
  //todos save state
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos(STORAGE_KEY));
  //Todos Priority
  const [priorityFilter, setPriorityFilter] = useState<Todo['priority'] | "all">(() => getInitialPriority(PRIORITY_KEY));
  //Todos filter State
  const [filter, setFilter] = useState<todoFilter>(() =>  getInitialFilter(FILTER_KEY) );

  //Edit Todos state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingOriginalText, setEditingOriginalText] = useState("");
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const cancelEditref = useRef(false)

  // Save todos in local Storage

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // save filter in local storage

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(FILTER_KEY, filter);
  }, [filter]);

   // save priorityin local storage

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PRIORITY_KEY, priorityFilter);
  }, [priorityFilter]);

  //Click edit button will focus eidtInput
  useEffect(() => {
    if (editingId !== null) editInputRef.current?.focus();
  }, [editingId]);

  //Url params for filter
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    url.searchParams.set("filter", filter);
    url.searchParams.set("priority", priorityFilter);
    window.history.replaceState({}, "", url.toString());
  }, [filter, priorityFilter]);


  //FilterTodos to show active or completed
  const filteredTodos = todos.filter((todo) => {
    let statusMatch = false;
    let priorityMatch = false;

    if (filter === "all") {
      statusMatch = true;
    } else if (filter === "active") {
      statusMatch = !todo.completed;
    } else if (filter === "completed") {
      statusMatch = todo.completed;
    }

    if (priorityFilter === "all") {
      priorityMatch = true;
    } else {
      priorityMatch = todo.priority === priorityFilter;
    }

    return statusMatch && priorityMatch;

  });

  //Sort todos that completed todos will appear in bottom
  const sortedTodos = filteredTodos.slice().sort((a, b) => {
    if (a.completed !== b.completed && filter === "all") {
      return a.completed ? 1 : -1;
    }

    return b.createdAt - a.createdAt;
  });

  //Todos Count
  const remainingTodos = todos.filter((todo) => !todo.completed).length;
  const completedTodos = todos.length - remainingTodos;
  const completionRate =
    todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;
  const hasTodos = todos.length > 0;
  const hasCompletedTodos = completedTodos > 0;
  const allCompletd = hasTodos && remainingTodos === 0;

  //Mark all complete or active todo
  const toggleBtn = () => {
    if (!hasTodos) return;
    setTodos((prev) =>
      prev.map((todo) => ({ ...todo, completed: !allCompletd })),
    );
  };

  //Clear Completed todos
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  // Clear all Todos
  const clearAll = () => {
    setTodos([]);
  };
  //Form Submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimedText = text.trim();
    const selectedPriority = priority;
    
    setTodos((prev) => [
      {
        id: Date.now(),
        text: trimedText,
        completed: false,
        createdAt: Date.now(),
        priority: selectedPriority
      },
      ...prev,
    ]);
    
    setText("");
    setPriority("low");
  };

  //complete todo action
  const toggleTodo = (id: number) => {
    setTodos((prev) => {
      return prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
    });
  };

  //Edit todo text
  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
    setEditingOriginalText(text);
  };

  //Save Edited text
  const commitTodo = () => {
    if (editingId === null) return;
    const trimmedText = editingText.trim();
    const todoText = trimmedText.length > 0 ? trimmedText : editingOriginalText;
    setTodos((prev) => {
      return prev.map((todo) =>
        todo.id === editingId ? { ...todo, text: todoText } : todo,
      );
    });
    setEditingId(null);
    setEditingText("");
    setEditingOriginalText("");
  };

  //Saved text by enter or escape key to cancel
  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitTodo();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEdit();
    }
  };

  //Delete todo
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
      setEditingOriginalText("");
    }
  };


  //Cancel edit
  const cancelEdit = () =>{
    cancelEditref.current= true;
    setEditingId(null);
    setEditingText("");
    setEditingOriginalText("");

    setTimeout(()=>{
      cancelEditref.current = false
    }, 0);
  }


  //Handle outside click to save 
 const handleEditBlur = () =>{
  if(cancelEditref.current){
    cancelEditref.current = false;
    return;
  }
  commitTodo();
 }

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

  return (
    <>
      <div className="p-4 flex flex-col justify-center items-center my-5">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl">Simple Todo App</h2>
          <p>
            Track what needs to be tackled next. Add todos, toggle their
            completion state, edit existing items, and quickly clear the
            finished work.
          </p>
        </div>
        <div className="max-w-150 mx-auto my-6 rounded-xl p-5 bg-linear-to-r from-gray-200 to-zinc-100 text-black">
          <form className="flex items-center gap-3" onSubmit={handleSubmit}>
            <input
              className="flex-1 px-1 py-3 border border-indigo-200 focus:outline-none rounded-sm "
              aria-label="Todo description"
              placeholder="Add a new task..."
              value={text}
              required
              onChange={(event) => setText(event.target.value)}
            />
            <select 
            className="bg-indigo-200 px-2 py-4 rounded-sm focus:outline-none"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Todo["priority"])} 
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button className="bg-indigo-500 p-4 rounded-sm cursor-pointer text-white">
              Add
            </button>
          </form>

          {/* To - Do toolbar */}
          <div className="pt-4 flex flex-col gap-4.5">
            {/* Status */}
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
            <div className="flex flex-wrap items-center gap-2">
              {/* To do filter */}
              <Button 
               onClick={() => setFilter('all')}
               pressed={filter === 'all'}
              >
                All
              </Button>
              <Button 
               onClick={() => setFilter('active')}
               pressed={filter === 'active'}
              >
                Active
              </Button>
              <Button 
               onClick={() => setFilter('completed')}
               pressed={filter === 'completed'}
              >
                Completed
              </Button>
              {/* Priority Based Filter */}
              <Button 
                onClick={() => setPriorityFilter("high")}
                pressed={priorityFilter === "high"}
              >
                High
              </Button>
              <Button 
                onClick={() => setPriorityFilter("medium")}
                pressed={priorityFilter === "medium"}
              >
                Medium
              </Button>
              <Button 
                onClick={() => setPriorityFilter("low")}
                pressed={priorityFilter === "low"}  
              >
                Low
              </Button>
              {/* To do button action */}
              <Button onClick={toggleBtn} disabled={!hasTodos} ariaDisabled={!hasTodos}>
                  {allCompletd ? "Mark all active" : "Mark all complete"}
              </Button>
              <Button onClick={clearCompleted} disabled={!hasCompletedTodos} ariaDisabled={!hasCompletedTodos}>
                  Clear completed
              </Button>
              <Button onClick={clearAll} disabled={!hasTodos} ariaDisabled={!hasTodos}>
                  Clear all
              </Button>
              <Button
                onClick={resetFilters}
                className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-sm"
              >
                Reset Filters
              </Button>

            </div>
            <ul className="flex flex-col gap-5">
              {sortedTodos.length === 0 && (
                <li className="px-4 py-3 bg-indigo-100 text-center font-semibold">Nothing to show here yet.</li>
              )}
              {sortedTodos.map((todo) => {
                const isEditing = todo.id === editingId;
                return (
                  <li className="todo-item" key={todo.id}>
                    <label className="todo-item-main">
                      <input
                        aria-label={
                          todo.completed
                            ? `Mark "${todo.text}" as active`
                            : `Mark "${todo.text}" as done`
                        }
                        checked={todo.completed}
                        type="checkbox"
                        onChange={() => toggleTodo(todo.id)}
                      />

                      {isEditing ? (
                        <input
                          aria-label="Edit todo text"
                          className="flex-1 px-1 py-1.5 border border-indigo-200 focus:outline-none rounded-sm "
                          ref={editInputRef}
                          value={editingText}
                          onBlur={handleEditBlur}
                          onChange={(event) =>
                            setEditingText(event.target.value)
                          }
                          onKeyDown={handleEditKeyDown}
                        />
                      ) : ( 
                        <><span>{todo.text}</span> <span className= {`px-2 py-1 rounded-full text-sm font-semibold capitalize ${priorityBadgeClasses[todo.priority]}`}>{todo.priority}</span></>
                        
                      )}
                    </label>
                    <div className="flex items-center gap-3">
                      {isEditing ? (
                        <>
                          <Button
                            className={`${buttonCommonClasses} ${actionButtonClasses}`}
                            onClick={commitTodo}
                            onMouseDown={(event) => event.preventDefault()}
                          >
                            Save
                          </Button>
                          <Button
                            className={`${buttonCommonClasses} ${actionButtonClasses}`}
                            onClick={cancelEdit}
                            onMouseDown={(event) => event.preventDefault()}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className={`${buttonCommonClasses} ${actionButtonClasses}`}
                            onClick={() => startEditing(todo.id, todo.text)}
                          >
                            Edit
                          </Button>
                          <Button
                            className={`${buttonCommonClasses} ${actionButtonClasses}`}
                            aria-label="Delete todo"
                            onClick={() => deleteTodo(todo.id)}
                          >
                            X
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
