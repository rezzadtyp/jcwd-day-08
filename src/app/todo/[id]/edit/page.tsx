"use client";

import { useTodos } from "@/helpers/useTodos";
import { Todo } from "@/utils/interface";
import { todoSchema } from "@/utils/validation/todo.schema";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

const EditPage = () => {
  const { id } = useParams();
  const { getTodoById, updateTodo } = useTodos();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleSubmit = async (values: Todo) => {
    if (!todo) return;
    try {
      await updateTodo(todo.objectId, {
        title: values.title,
        completed: values.completed,
      });
      router.push(`/todo/${todo.objectId}`);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getTodoById(id as string)
        .then((data) => {
          if (data) {
            setTodo(data);
            document.title = data.title;
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
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
      <div className="w-full max-w-md rounded-lg border p-8 shadow-lg">
        <button
          onClick={() => router.push("/todo/" + todo.objectId)}
          className="mt-4 text-blue-500 hover:underline"
        >
          Back to details
        </button>
        <h1>Edit Todo</h1>

        <Formik
          initialValues={{
            objectId: todo.objectId,
            title: todo.title,
            completed: todo.completed,
          }}
          validationSchema={toFormikValidationSchema(todoSchema)}
          onSubmit={handleSubmit}
          validateOnBlur={true}
          validateOnChange={true}
          validate={(values) => {
            console.log("Validating values:", values);
            return {};
          }}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="title">Title</label>
                <Field
                  name="title"
                  type="text"
                  className={`w-full p-2 rounded-md border ${
                    touched.title && errors.title ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div>
                <label htmlFor="completed" className="inline-flex items-center">
                  <Field
                    name="completed"
                    type="checkbox"
                    className="mr-2 h-4 w-4"
                  />
                  Completed
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
        {/* <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-700 mt-4"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />

            <div className="mb-4 mt-4">
              <input
                type="checkbox"
                id="completed"
                checked={formData.completed}
                onChange={(e) =>
                  setFormData({ ...formData, completed: e.target.checked })
                }
                className="mt-2"
              />
              <label htmlFor="completed" className="ml-2">
                Completed
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-blue-500 px-4 py-2 font-semibold text-white shadow hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form> */}
      </div>
    </div>
  );
};

export default EditPage;
