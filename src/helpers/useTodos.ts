"use client";
import { useState, useEffect } from "react";
import { api } from "@/utils/api/api";
import { Todo } from "@/utils/interface";

export function useTodos(query?: string) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchTodos() {
    try {
      setLoading(true);

      let url = "/todo?sortBy=created%20desc";
      if (query) {
        url += `&where=${encodeURIComponent(`title LIKE '%${query}%' `)}`;
      }

      const response = await api.get<Todo[]>(url);
      setTodos(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function getTodoById(id: string) {
    try {
      const response = await api.get<Todo>(`/todo/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function createTodo(title: string) {
    try {
      const response = await api.post("/todo", {
        title: title,
        completed: false,
      }); // ketika melakukan POST, sertakan body request
      setTodos((prev) => [...prev, response.data]);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateTodo(id: string, data: Partial<Todo>) {
    try {
      const response = await api.put(`/todo/${id}`, data); // body request untuk PUT atau edit todo
      setTodos((prev) =>
        prev.map((todo) => (todo.objectId === id ? response.data : todo))
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTodo(id: string) {
    try {
      await api.delete(`/todo/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.objectId !== id));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return { todos, loading, createTodo, updateTodo, deleteTodo, getTodoById };
}
