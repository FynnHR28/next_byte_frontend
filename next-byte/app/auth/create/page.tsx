"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonStyle, backButtonStyle } from "../styles";  
import { request } from "@/api_client/api_request";
import ReForm from "@/components/userInput/reusableForm"
import { Input } from "@/components/userInput/reusableInput";
import ExistingAccountOverlay from "../components/existingAccountOverlay";

const inputStyle = "bg-gray-50 text-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200 w-full";
const labelStyle = "text-gray-500 font-medium";

export default function Create() {
  const router = useRouter(); 
  const [serverError, setServerError] = useState('')
  const [email, setEmail] = useState("")

  const handleSubmit = async (data:Record<string,string>) => {
    const username = data['username'];
    const password = data['password'];
    const email = data['email'];
    try {
      await request({
          query: `
            mutation CreateUser($username: String!, $password: String!, $email: String!) {
              createUser(username: $username, password: $password, email: $email) {
                id
              }
            }
          `,
          variables: { username, password, email },
      })
      router.push("/auth/login");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
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

        {/* TODO: Have shared file with errors to have a single source of truth?*/}
        {serverError === "Error: Account was deleted" ? (
          <ExistingAccountOverlay email={email} onResolved={() => setServerError("")} />
        ) : null}

        <ReForm
          className="flex flex-col gap-4 mt-6"
          onSubmit={handleSubmit}
          error={serverError}
          onValuesChange={(values: Record<string, string>) => {
            setEmail(values.email ?? "");
          }}
        >
            <Input 
              inputStyle={inputStyle} 
              labelStyle={labelStyle} 
              name="email" 
              placeholder='Email'
              fontStyle={{ fontFamily: "Verdana" }}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9_.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address"
                }
               
              }}
            />
            <Input 
              inputStyle={inputStyle}
              labelStyle={labelStyle}
              type="text"
              name="username"
              placeholder="Username"
              fontStyle={{ fontFamily: "Verdana" }}
              rules={{
                required: "Username is required"
              }}
            />
            <Input 
              inputStyle={inputStyle}
              labelStyle={labelStyle}
              type="password"
              name="password"
              placeholder="Password"
              fontStyle={{ fontFamily: "Verdana" }}
              rules={{
                required: "Password is required"
              }}
            />

        </ReForm>
      </div>
    </main>
  )
}
