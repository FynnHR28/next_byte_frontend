"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonStyle, backButtonStyle } from "../styles";
import { request } from "@/api_client/api_request";
import ReForm from "@/components/userInput/reusableForm"
import { Input } from "@/components/userInput/reusableInput";

const inputStyle = "bg-gray-50 text-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200";
const labelStyle = "text-gray-500 font-medium -mb-2";


export default function Login() {
  const router = useRouter(); 
  const [serverError, setServerError] = useState('')

  const handleSubmit = async (data:Record<string, string>) => {
    
    const email = data['email'];
    const password = data['password'];

    try {
      await request({
          query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                token,
                user{
                  id
                }
              }
            }
          `,
          variables: { email, password },
      })
      router.push("/home");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unable to login");
    } finally {

    }
  };

  return (
    <main className="flex min-h-screen justify-center items-center bg-app-gradient">
      
      <div className="flex flex-col w-lg h-fit shadow-lg p-8 rounded-lg bg-white">
        <Link href="/">
          <button className={backButtonStyle} style={{ fontFamily: "Georgia" }}>
            Back
          </button>
        </Link>

        <h1 
        className="text-4xl text-black font-semibold" 
        style={{ fontFamily: "Georgia" }}
        >
          Login
        </h1>

        <ReForm className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit} error={serverError}>
            <Input 
              inputStyle={inputStyle} 
              labelStyle={labelStyle} 
              name="email" 
              placeholder='Email'
              fontStyle={{ fontFamily: "Verdana" }}
              rules={{
                required: "email is required",
                pattern: {
                  value: /^[A-Z0-9_.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address"
                }
               
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
                required: "password is required"
              }}
            />

        </ReForm>

      </div>
    </main>
  )
}
