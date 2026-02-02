"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonStyle, backButtonStyle } from "../styles";  

const inputStyle = "bg-gray-50 text-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200";
const labelStyle = "text-gray-500 font-medium -mb-2";
const GRAPHQL_URL = process.env.GRAPHQL_URL ?? "http://localhost:9000/graphql";

export default function Create() {
  const router = useRouter(); 
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent automatic reloads/navigation which would lose state
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation CreateUser($username: String!, $password: String!, $email: String!) {
              createUser(username: $username, password: $password, email: $email) {
                id
              }
            }
          `,
          variables: { username, password, email },
        }),
      });
      const result = await response.json();
      if (result.errors?.length > 0) {
        throw new Error(result.errors[0].message);
      }
      router.push("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen justify-center items-center bg-app-gradient">
      <Link href="/">
        <button className={backButtonStyle} style={{ fontFamily: "Georgia" }}>
          Back
        </button>
      </Link>

      <div className="flex flex-col w-lg h-fit shadow-lg p-8 rounded-lg bg-white">
        <h1 
        className="text-4xl text-black font-semibold" 
        style={{ fontFamily: "Georgia" }}
        >
          Create Account
        </h1>

        <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
          <label 
            htmlFor="email_address"
            className={labelStyle}
            style={{ fontFamily: "Verdana" }}
          >
            Email
          </label>
          <input
            className={inputStyle}
            id="email_address"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label 
            htmlFor="username"
            className={labelStyle}
            style={{ fontFamily: "Verdana" }}
          >
            Username
          </label>
          <input
            className={inputStyle}
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <label 
            htmlFor="password"
            className={labelStyle}
            style={{ fontFamily: "Verdana" }}
          >
            Password
          </label>
          <input
            className={inputStyle}
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error ? (
            <p className="text-sm text-red-600" style={{ fontFamily: "Verdana" }}>
              {error}
            </p>
          ) : null}

          <button
            className={buttonStyle}
            style={{ fontFamily: "Georgia" }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </main>
  )
}
