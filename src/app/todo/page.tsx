"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toFormikValidate, toFormikValidationSchema } from "zod-formik-adapter";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useMemo } from "react";

import TodoItem from "@/components/TodoItem";

import { useTodos } from "@/helpers/useTodos";

import { todoSchema } from "@/utils/validation/todo.schema";

import { Todo } from "@/utils/interface";

export default function TodoList() {
  const router = useRouter();
  const searchParams = useSearchParams(); // untuk mengambil params di URL
  const searchQuery = searchParams.get("search") || ""; // untuk mengambil query di URL

  const [title, setTitle] = useState<string>("");
  const [editing, setEditing] = useState<Todo | null>(null);
  const [search, setSearch] = useState<string>(searchQuery);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [sorting, setSorting] = useState<"asc" | "desc">("desc");

  const { todos, loading, createTodo, updateTodo, deleteTodo } =
    useTodos(searchQuery);

  // fungsi untuk melakukan filtering data
  const filteredTodos = useMemo(() => {
    let data = [...todos];

    if (filter === "completed") {
      data = data.filter((item) => item.completed);
    } else if (filter === "pending") {
      data = data.filter((item) => !item.completed);
    }

    return data.sort((a, b) => {
      const aTime = new Date(a.created ?? 0).getTime();
      const bTime = new Date(b.created ?? 0).getTime();
      return sorting === "asc" ? aTime - bTime : bTime - aTime;
    });
  }, [todos, filter, sorting]);

  // fungsi untuk melakukan search data
  function handleSearch(e: React.FormEvent) {
    e.preventDefault(); // untuk mencegah rendering ketika handleSearch ditrigger
    if (search.trim() === "") {
      router.push("/todo");
    } else {
      router.push(`/todo?search=${encodeURIComponent(search)}`);
    }
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Tidy Task</h1>

      {/* form untuk todo */}
      <Formik
        initialValues={{ title: editing?.title || "" }}
        validationSchema={toFormikValidationSchema(todoSchema)}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          if (editing) {
            updateTodo(editing.objectId, { title: values.title });
          } else {
            createTodo(values.title);
          }
          resetForm();
        }}
      >
        <Form className="flex gap-2 mb-4 items-start flex-col sm:flex-row">
          <div className="w-full">
            <Field
              name="title"
              type="text"
              placeholder="Enter todo ..."
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
          >
            {editing ? "Update" : "Add"}
          </button>
        </Form>
      </Formik>

      {/* fitur untuk melakukan searching */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-md"
          type="submit"
        >
          Search
        </button>
      </form>

      {/* fitur untuk melakukan filtering */}
      <div className="flex justify-between mb-4">
        <select
          value={filter}
          className="border p-2 rounded-md"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFilter(e.target.value as "all" | "completed" | "pending")
          }
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Not Completed</option>
        </select>

        {/* untuk melakukan sorting berdasarkan Created Date */}
        <button
          onClick={() =>
            setSorting((prev) => (prev === "asc" ? "desc" : "asc"))
          }
          className="border px-4 py-2 rounded-md"
        >
          Sort by Date : {sorting.toUpperCase()}
        </button>
      </div>

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100 text-sm text-gray-600">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-center">Completed</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos?.length > 0 ? (
            filteredTodos.map((todo: Todo) => (
              <TodoItem
                key={todo.objectId}
                todo={todo}
                onEdit={(edit) => {
                  setTitle(edit.title);
                  setEditing(edit);
                }}
                onDelete={() => deleteTodo(todo.objectId)}
              />
            ))
          ) : (
            <tr>
              <td colSpan={3} className="p-2 text-center text-gray-500">
                No todos found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
