import { useState, useRef, useEffect } from "react";

/**
 * This custom hook that returns an object containing the state and functions to edit a todo.
 * This hook manages the editing state, text, and due date for a todo item.
 */
export function useEditableTodo(initialText: string, initialDueDate?: number) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(initialText);
  const [editingDueDate, setEditingDueDate] = useState<Date | null>(
    initialDueDate ? new Date(initialDueDate) : null,
  );
  const editInputRef = useRef<HTMLInputElement | null>(null);
  const cancelEditref = useRef(false);

  //Click edit button will focus eidtInput
  useEffect(() => {
    if (isEditing) editInputRef.current?.focus();
  }, [isEditing]);

  //Select which text to edit
  const startEditing = () => {
    setIsEditing(true);
    setEditingText(initialText);
    setEditingDueDate(initialDueDate ? new Date(initialDueDate) : null);
  };

  const cancelEdit = () => {
    cancelEditref.current = true;
    setIsEditing(false);
    setEditingText(initialText);
    setEditingDueDate(initialDueDate ? new Date(initialDueDate) : null);
    setTimeout(() => {
      cancelEditref.current = false;
    }, 0);
  };

  const commitTodoText = (
    onSave: (value: string, dueDate?: number) => void,
  ) => {
    const trimmedText = editingText.trim();
    onSave(trimmedText || initialText, editingDueDate?.getTime());
    setIsEditing(false);
  };

  return {
    isEditing,
    editingText,
    setEditingText,
    editInputRef,
    startEditing,
    cancelEdit,
    commitTodoText,
    editingDueDate,
    setEditingDueDate,
  };
}
