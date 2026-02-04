import { useState, useRef, useEffect } from "react";
import { buttonCommonClasses, actionButtonClasses } from "../customStyle/style";
import { priorityBadgeClasses, type Todo } from "../typescript/interface";
import Button from "./Button";

type TodoItemProps = {
  todo: Todo;
  toggleTodo: (id: number) => void;
  updateTodo: (id: number, text: string) => void;
  deleteTodo: (id: number) => void;
};

export default function TodoItem({
  todo,
  toggleTodo,
  updateTodo,
  deleteTodo,
}: TodoItemProps) {
  //Edit Todos state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingOriginalText, setEditingOriginalText] = useState("");
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const cancelEditref = useRef(false);

  //Click edit button will focus eidtInput
  useEffect(() => {
    if (editingId !== null) editInputRef.current?.focus();
  }, [editingId]);

  //Edit todo text
  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditingText(text);
    setEditingOriginalText(text);
    setIsEditing(true);
  };

  //Save Edited text
  const commitTodo = () => {
    if (editingId === null) return;
    const trimmedText = editingText.trim();
    const todoText = trimmedText.length > 0 ? trimmedText : editingOriginalText;
    updateTodo(editingId, todoText);
    setEditingId(null);
    setEditingText("");
    setEditingOriginalText("");
    setIsEditing(false);
  };

  //Saved text by enter or escape key to cancel
  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitTodo();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  };

  //Cancel edit
  const cancelEdit = () => {
    cancelEditref.current = true;
    setEditingId(null);
    setEditingText("");
    setIsEditing(false);
    setTimeout(() => {
      cancelEditref.current = false;
    }, 0);
  };

  //Handle outside click to save
  const handleEditBlur = () => {
    if (cancelEditref.current) {
      cancelEditref.current = false;
      return;
    }
    commitTodo();
  };
  return (
    <li className="todo-item">
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
            onChange={(event) => setEditingText(event.target.value)}
            onKeyDown={handleEditKeyDown}
          />
        ) : (
          <>
            <span
                className={`${
                    todo.completed ? "line-through text-gray-400" : ""
                }`}
                >
                {todo.text}
                </span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-sm font-semibold capitalize ${priorityBadgeClasses[todo.priority]}`}
            >
              {todo.priority}
            </span>
          </>
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
}
