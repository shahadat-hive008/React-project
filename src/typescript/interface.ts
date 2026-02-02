export interface Todo {
    id: number,
    text: string,
    completed: boolean,
    createdAt: number,
    priority: string
}

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