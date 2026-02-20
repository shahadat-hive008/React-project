import { priorityBadgeClasses, type Todo } from "../typescript/interface";
import Button from "./Button";
import { useEditableTodo } from "../hook/useEditableTodo";
import DatePicker from "react-datepicker";
import { actionButtonClasses, buttonCommonClasses } from "../customStyle/style";

type TodoItemProps = {
  todo: Todo;
  toggleTodo: (id: number) => void;
  updateTodo: (id: number, text: string, dueDate?: number) => void;
  deleteTodo: (id: number) => void;
};

export default function TodoItem({
  todo,
  toggleTodo,
  updateTodo,
  deleteTodo,
}: TodoItemProps) {
  const {
    isEditing,
    editInputRef,
    editingText,
    setEditingText,
    commitTodoText,
    cancelEdit,
    startEditing,
    editingDueDate,
    setEditingDueDate,
  } = useEditableTodo(todo.text, todo.dueDate);

  // This function handle enter and esc key to svae and cancel todo
  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter")
      commitTodoText((v, dueDate) => updateTodo(todo.id, v, dueDate));

    if (event.key === "Escape") cancelEdit();
  };

  return (
    <li className="todo-item">
      <label>
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
      </label>

      {isEditing ? (
        <>
          <input
            aria-label="Edit todo text"
            className="flex-1 px-1 py-1.5 border border-indigo-200 focus:outline-none rounded-sm "
            ref={editInputRef}
            value={editingText}
            onChange={(event) => setEditingText(event.target.value)}
            onKeyDown={handleEditKeyDown}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-0.5"
          >
            <DatePicker
              className="border border-indigo-200 pointer-none:"
              showIcon
              selected={editingDueDate}
              onChange={setEditingDueDate}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </>
      ) : (
        <div className="flex-3 flex items-center justify-evenly gap-3">
          <span
            className={`${
              todo.completed ? "line-through text-gray-400" : ""
            }wrap-break-word`}
          >
            {todo.text}
          </span>{" "}
          <span
            className={`px-2 py-1 rounded-full text-sm font-semibold capitalize ${priorityBadgeClasses[todo.priority]}`}
          >
            {todo.priority}
          </span>
          {todo.dueDate && (
            <span className="bg-indigo-200 p-2 rounded-full text-sm font-semibold wrap-normal">
              {new Date(todo.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 flex-1 justify-end">
        {isEditing ? (
          <>
            <Button
              className={`${buttonCommonClasses} ${actionButtonClasses}`}
              onClick={() =>
                commitTodoText((value, dueDate) =>
                  updateTodo(todo.id, value, dueDate),
                )
              }
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
              onClick={startEditing}
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
