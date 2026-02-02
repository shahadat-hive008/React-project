import { useEffect, useRef, useState } from "react";
import { seededData } from "./data/fake-data";
import type { Todo, todoFilter } from "./typescript/interface";
import { buttonCommonClasses, actionButtonClasses } from "./customStyle/style";
import Button from "./components/Button";

const STORAGE_KEY = "react-play:simple-todo-app";
const FILTER_KEY = `${STORAGE_KEY}:filter`;

function App() {
  //Input text
  const [text, setText] = useState("");
  //Select text 
  const [priority, setPriority] = useState("Low");

  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === "undefined") return seededData;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return seededData;
      const parsed = JSON.parse(stored) as Array<Partial<Todo>>;
      if (!Array.isArray(parsed)) return seededData;

      const fallbackTime = Date.now();
      const sanitized = parsed
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
          priority: todo.priority
        }))
        .filter((todo) => todo.text.length > 0);
      return sanitized.length > 0 ? sanitized : seededData;
    } catch (e) {
      return seededData;
    }
  });

  const [filter, setFilter] = useState<todoFilter>(() => {
    if (typeof window === "undefined") return "all";
    const stored = window.localStorage.getItem(FILTER_KEY);
    if (stored === "all" || stored === "active" || stored === "completed")
      return stored;

    return "all";
  });

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

  //Click edit button will focus eidtInput
  useEffect(() => {
    if (editingId !== null) editInputRef.current?.focus();
  }, [editingId]);

  //FilterTodos to show active or completed
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return todo;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return false;
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
              onChange={(event) => setText(event.target.value)}
            />
            <select 
            className="bg-indigo-200 px-2 py-4 rounded-sm focus:outline-none"
            onChange={(e) => setPriority(e.target.value as any)} 
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
                {remainingTodos} {remainingTodos === 1 ? "task" : "tasks"} left
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
               className={filter === 'all' ? 'bg-indigo-400' : 'bg-indigo-100 hover:bg-indigo-200'}
              >
                All
              </Button>
              <Button 
               onClick={() => setFilter('active')}
               pressed={filter === 'active'}
               className={filter === 'active' ? 'bg-indigo-400' : 'bg-indigo-100 hover:bg-indigo-200'}
              >
                Active
              </Button>
              <Button 
               onClick={() => setFilter('completed')}
               pressed={filter === 'completed'}
               className={filter === 'completed' ? 'bg-indigo-400' : 'bg-indigo-100 hover:bg-indigo-200'}
              >
                Completed
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
                          className="flex-1 px-1 py-3 border border-indigo-200 focus:outline-none rounded-sm "
                          ref={editInputRef}
                          value={editingText}
                          onBlur={handleEditBlur}
                          onChange={(event) =>
                            setEditingText(event.target.value)
                          }
                          onKeyDown={handleEditKeyDown}
                        />
                      ) : (
                        <span>{todo.text}</span>
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
