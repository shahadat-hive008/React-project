import { useState, useRef, useEffect } from "react";

/**
 * Custom hook for managing editable todo item state
 *
 * This hook manages the editing state, text, and due date for a todo item.
 * It handles focus management, edit state tracking, and provides methods for
 * starting, canceling, and committing edits.
 *
 * @param {string} initialText - The initial text content of the todo item
 * @param {number} [initialDueDate] - Optional initial due date timestamp in milliseconds
 *
 * @returns {Object} An object containing:
 *   - {boolean} isEditing - Whether the todo is currently being edited
 *   - {string} editingText - The current text being edited
 *   - {React.Dispatch<React.SetStateAction<string>>} setEditingText - Function to update editing text
 *   - {React.RefObject<HTMLInputElement | null>} editInputRef - Ref to the edit input element for focus management
 *   - {Function} startEditing - Function to begin editing mode and reset values to initial state
 *   - {Function} cancelEdit - Function to cancel editing and revert to initial values
 *   - {Function} commitTodoText - Function to save changes with a callback that receives trimmed text and due date
 *   - {Date | null} editingDueDate - The due date being edited or null
 *   - {React.Dispatch<React.SetStateAction<Date | null>>} setEditingDueDate - Function to update editing due date
 *
 * @example
 * const {
 *   isEditing,
 *   editingText,
 *   setEditingText,
 *   editInputRef,
 *   startEditing,
 *   cancelEdit,
 *   commitTodoText,
 *   editingDueDate,
 *   setEditingDueDate
 * } = useEditableTodo("Buy groceries", Date.now());
 *
 * // Start editing the todo
 * startEditing();
 *
 * // Update the text
 * setEditingText("Buy groceries and cook dinner");
 *
 * // Save changes
 * commitTodoText((text, dueDate) => {
 *   console.log("Saved:", text, dueDate);
 * });
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
