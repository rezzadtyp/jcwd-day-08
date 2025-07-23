"use client";

import { useTodos } from "@/helpers/useTodos";
import { Todo } from "@/utils/interface";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TodoDetail() {
  const { id } = useParams();
  const { getTodoById } = useTodos();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    getTodoById(id as string).then((data) => {
      if (data) {
        setTodo(data);
        document.title = data.title;
      }
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border p-8 shadow-lg">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border p-8 shadow-lg">
          <h2>Todo not found</h2>
          <button
            onClick={() => router.push("/todo")}
            className="mt-4 text-blue-500 hover:underline"
          >
            Back to list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border p-8 shadow-lg flex flex-col gap-4">
        <h2>{todo.title}</h2>
        <p className={`${todo.completed ? "text-green-500" : "text-red-500"}`}>
          {todo.completed ? "Completed" : "Not Completed"}
        </p>
        <button
          onClick={() => router.push("/todo")}
          className="mt-4 text-blue-500 hover:underline w-fit"
        >
          Back to list
        </button>
        <button
          onClick={() => router.push(`/todo/${todo.objectId}/edit`)}
          className="mt-4 text-yellow-500 hover:underline w-fit"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
