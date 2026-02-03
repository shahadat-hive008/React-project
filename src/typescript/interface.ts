

export interface Todo {
    id: number,
    text: string,
    completed: boolean,
    createdAt: number,
    priority: "high" | "medium" | "low"
}

export const priorityBadgeClasses: Record<Todo["priority"], string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-green-100 text-green-700",
  low: "bg-blue-100 text-blue-700",
};


export type todoFilter = "all" | "active" | "completed";

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