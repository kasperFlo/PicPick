"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/"); // Redirect to homepage after login
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-black">
          Sign In to Continue
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black text-black"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-black mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black text-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-900"
        >
          Sign In
        </button>

        <div className="text-center text-sm text-gray-500">or</div>

        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full border border-gray-300 py-2 rounded hover:bg-gray-100 text-black"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
