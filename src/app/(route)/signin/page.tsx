"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import { useUser } from "@/app/contexts/UserProvider";


export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const {user, setUser} = useUser(); 
  
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
  
  function handleCallbackResponse(response: any) {
    try {
      console.log("Encoded JWT ID token: " + response.credential);
      var decoded = jwtDecode(response.credential);
      console.log( "Decoded JWT ID token: ", decoded, "name :" + decoded.name, "email :" + decoded.email);
      setUser({
        rawToken: response.credential,
        decodedToken: decoded,
        name: decoded.name || "",
        email: decoded.email || "",
        picture: decoded.picture || "",
      });
      router.push("/");
    
    } catch (error) {
      console.error("Error decoding JWT: ", error);
    }
  }
  
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCallbackResponse
    });
    
    google.accounts.id.renderButton(
      document.getElementById("signInDiv")!,
      { type: "standard", theme: "outline", size: "large" }
    );
  }, []);

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

        <div id="signInDiv" className="w-full flex justify-center"></div>
      </form>

        {user && 
          <div className="mt-4 text-sm text-gray-500">
            user.name: {user.name} <br />
            user.email: {user.email} <br />
            user.picture: {user.picture} <br />
            <img src={user.picture}/>
          </div>
        }  

    </div>
  );
}
