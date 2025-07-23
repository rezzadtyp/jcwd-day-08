import { Todo } from "@/utils/interface";
import { useRouter } from "next/navigation";

interface TodoProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onEdit, onDelete }: TodoProps) {
  const router = useRouter();
  return (
    <tr className="border-b text-sm text-gray-700">
      <td className="p-2">{todo.title}</td>
      <td className="p-2 text-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onEdit({ ...todo, completed: !todo.completed })}
          className="h-4 w-4"
        />
      </td>
      <td className="p-2 space-x-2 text-center">
        <button
          onClick={() => onEdit(todo)}
          className="text-blue-500 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.objectId)}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
        <button
          onClick={() => router.push("todo/" + todo.objectId)}
          className="text-yellow-500 hover:underline"
        >
          Details
        </button>
      </td>
    </tr>
  );
}
