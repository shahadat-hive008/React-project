import type { Todo } from "../typescript/interface";

interface TodoTableProps {
  todos: Todo[];
}
export default function TodoTable({ todos }: TodoTableProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #000", padding: 12 }}>
            Todo complete
          </th>
          <th style={{ border: "1px solid #000", padding: 12 }}>Todo</th>
          <th style={{ border: "1px solid #000", padding: 12 }}>Priority</th>
          <th style={{ border: "1px solid #000", padding: 12 }}>Due Date</th>
        </tr>
      </thead>
      <tbody>
        {todos.map((todo) => (
          <tr key={todo.id}>
            <td style={{ border: "1px solid #000", padding: 12 }}>
              {todo.completed && <span style={{ color: "green" }}>✓</span>}
            </td>
            <td style={{ border: "1px solid #000", padding: 12 }}>
              {todo.text}
            </td>
            <td
              style={{
                border: "1px solid #000",
                padding: 12,
                textTransform: "capitalize",
              }}
            >
              {todo.priority}
            </td>
            <td style={{ border: "1px solid #000", padding: 12 }}>
              {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
