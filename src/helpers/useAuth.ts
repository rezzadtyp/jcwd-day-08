"use client";

import { api } from "@/utils/api/api";
import { User } from "@/utils/interface";

export function useAuth() {
  async function register({ email, password }: User) {
    try {
      const response = await api.post("/user", { email, password });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await api.get("/user");
      const found = response.data.find(
        (item: any) => item.email === email && item.password === password
      );
      if (found) {
        return found;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return { register, login };
}
