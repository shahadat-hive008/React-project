import { useState } from "react";
import type { Todo } from "../typescript/interface";

type formHandleProp = {
    onSubmit : (text:string ,priority : Todo["priority"]) => void;
}
export default function FormComponent({onSubmit}:formHandleProp) {
   //Input text
  const [text, setText] = useState("");
  //Select text
  const [priority, setPriority] = useState<Todo["priority"]>("low");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimedText = text.trim();
    const selectedPriority = priority;

    if (trimedText.length > 0) {
      onSubmit(trimedText, selectedPriority);
    }

    setText("");
    setPriority("low");
  };
  return (
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
  )
}
