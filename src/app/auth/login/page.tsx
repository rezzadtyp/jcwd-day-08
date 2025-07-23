"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "@/helpers/useAuth";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { User } from "@/utils/interface";
import { useRouter } from "next/navigation";

import { authSchema } from "@/utils/validation/auth.schema";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(values: User) {
    try {
      const res = await login(values.email, values.password || "");
      console.log("Login response:", res);
      if (res) {
        alert(`Successfully login, welcome ${values.email.split("@")[0]}`);
        router.push("/todo");
      } else {
        alert("Login failed, please check your email and password.");
      }
    } catch (error) {
      console.log("Failed : ", error);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={toFormikValidationSchema(authSchema)}
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
              <label className="block mb-1">Email</label>
              <Field
                name="email"
                type="email"
                className={`w-full p-2 rounded-md border ${
                  touched.email && errors.email ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <Field
                name="password"
                type="password"
                className={`w-full p-2 rounded-md border ${
                  touched.password && errors.password ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 w-full rounded-md disabled:bg-green-400"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
