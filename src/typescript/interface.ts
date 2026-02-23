//Todo interface
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: "high" | "medium" | "low";
  dueDate?: number;
}

export type TodoFilter = "all" | "active" | "completed";

//Main Button component
export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaDisabled?: boolean;
  pressed?: boolean;
  className?: string;
  ariaLabel?: string;
  onMouseDown?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

//In App page show button action using object
export type ButtonConfig = {
  type: "action";
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

//Form component props
export interface formHandleProp {
  onSubmit: (
    text: string,
    priority: Todo["priority"],
    dueDate: Todo["dueDate"],
  ) => void;
}

//TodoItem component props
export interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: number) => void;
  updateTodo: (id: number, text: string, dueDate?: number) => void;
  deleteTodo: (id: number) => void;
}

//TodoTable component props
export interface TodoTableProps {
  todos: Todo[];
}

//For priority css design
export const priorityBadgeClasses: Record<Todo["priority"], string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-green-100 text-green-700",
  low: "bg-blue-100 text-blue-700",
};
