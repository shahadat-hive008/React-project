import { useState } from "react";
import type { formHandleProp, Todo } from "../typescript/interface";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function FormComponent({ onSubmit }: formHandleProp) {
  //Input text
  const [text, setText] = useState("");
  //Select text
  const [priority, setPriority] = useState<Todo["priority"]>("low");
  //Due Date
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimedText = text.trim();
    const selectedPriority = priority;
    const dueDate = selectedDate;
    if (trimedText.length > 0) {
      onSubmit(trimedText, selectedPriority, Number(dueDate));
    }

    setText("");
    setPriority("low");
  };
  return (
    <form
      className="grid grid-cols-1 lg:grid-cols-2 items-center gap-3 "
      onSubmit={handleSubmit}
    >
      <input
        className="lg:col-span-2 px-1 py-3 border border-indigo-200 focus:outline-none rounded-sm "
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

      <div className="flex items-center gap-0.5">
        <span className="font-semibold text-sm">Due Date: </span>
        <DatePicker
          className="border border-indigo-200"
          showIcon
          selected={selectedDate}
          onChange={setSelectedDate}
          dateFormat="dd/MM/yyyy"
        />
      </div>
      <button className="lg:col-span-2 bg-indigo-500 p-4 rounded-sm cursor-pointer text-white">
        Add
      </button>
    </form>
  );
}
