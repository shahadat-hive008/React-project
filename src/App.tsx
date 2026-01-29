import { useEffect, useState, type FormEvent } from "react";
import { seededData } from "./data/fake-data";
import type { Todo } from "./typescript/interface";




const STORAGE_KEY = 'react-play:simple-todo-app';
const FILTER_KEY = `${STORAGE_KEY}:filter`;

function App() {
  //Input text
  const [text, setText] = useState("");

  // Css class for button
  const buttonCommonClasses = "px-4 py-2 bg-indigo-100 rounded-full border border-transparent text-black transition hover:bg-indigo-200 cursor-pointer"
 
  const [todos, setTodos] = useState<Todo[]>(()=>{
    if(typeof window === "undefined") return seededData;
    try{
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if(!stored) return seededData;
      const parsed = JSON.parse(stored) as Array<Partial <Todo>>;
      if(!Array.isArray(parsed)) return seededData;

      const fallbackTime = Date.now();
      const sanitized = parsed.filter((todo): todo is Partial<Todo> & Required <Pick <Todo, "text">> => 
        typeof todo === "object" && todo  !== null && typeof todo.text === "string"
       ).map((todo, index) =>({
        id : typeof todo.id === "number" ? todo.id : fallbackTime + index,
        text: todo.text.trim(),
        completed : Boolean(todo.completed),
        createdAt : typeof todo.createdAt === "number" ? todo.createdAt : fallbackTime + index,
       })).filter((todo) => todo.text.length > 0);
       return sanitized.length > 0 ? sanitized : seededData;
    } catch(e){
      return seededData;
    }
  })

  // Save todos in local Storage

  useEffect(()=>{
      if(typeof window === "undefined") return;

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos])

  //Form Submit
  const handleSubmit =(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimedText = text.trim();
    setTodos((prev) => [
       {
        id: Date.now(),
        text: trimedText,
        completed: false,
        createdAt: Date.now()
      },
      ...prev
    ]);

    setText("");
  }
  
  return (
    <>
      <div className="p-4 flex flex-col justify-center items-center ">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl">Simple Todo App</h2>
          <p>
            Track what needs to be tackled next. Add todos, toggle their
            completion state, edit existing items, and quickly clear the
            finished work.
          </p>
        </div>
        <div className="max-w-130 mx-auto my-6 rounded-xl p-5 bg-linear-to-r from-gray-200 to-zinc-100 text-black">
          <form className="flex items-center gap-3" onSubmit={handleSubmit}>
            <input
              className="flex-1 px-1 py-3 border border-indigo-200 focus:outline-none rounded-sm "
              aria-label="Todo description"
              placeholder="Add a new task..."
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
            <button className="bg-indigo-500 p-4 rounded-sm cursor-pointer text-white">Add</button>
          </form>

          {/* To - Do toolbar */}
          <div className="pt-4 flex flex-col gap-4.5">
            {/* Status */}
            <p className="flex items-center gap-2">
              <span>task left</span>
              <span className="bg-indigo-300 rounded-2xl px-2 py-0.5">completed</span>
            </p>
            {/* To do filter */}
            <div className="flex flex-wrap items-center gap-2">
              <button className={buttonCommonClasses}>All</button>
              <button className={buttonCommonClasses}>Active</button>
              <button className={buttonCommonClasses}>Completed</button>
              <button className={buttonCommonClasses}>Mark all done</button>
              <button className={buttonCommonClasses}>Clear completed</button>
              <button className={buttonCommonClasses}>Clear all</button>
            </div>
            <ul className="flex flex-col gap-5">
              {
                todos.map(item => <li className="todo-item" key={item.id}>
                  <label className="todo-item-main">
                      <input
                        type="checkbox"
                      />

                      <span>{item.text}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button className={buttonCommonClasses}>Edit</button>
                    <button className={buttonCommonClasses}>X</button>
                  </div>
                </li>)
              }
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
