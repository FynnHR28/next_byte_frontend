'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const buttonStyle = "text-xl text-stone-600 hover:text-stone-800 bg-white rounded-full px-4 py-2 shadow-md hover:shadow-lg hover:scale-102 ease-in-out mb-6 cursor-pointer";
const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:9000/graphql";

export default function Settings() {
  const router = useRouter(); 
  const [error, setError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const deleteAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent automatic reloads/navigation which would lose state
    setError("");
    setIsDeletingAccount(true);

    // try {
    //   const response = await fetch(GRAPHQL_URL, {
    //     method: "POST",
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       query: `
    //         mutation Delete {
    //           deleteAccount
    //         }
    //       `,
    //     }),
    //   });
    //   const result = await response.json();
    //   if (result.errors?.length > 0) {
    //     throw new Error(result.errors[0].message);
    //   }
    //   router.push('/auth/login')
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : "Unable to delete account");
    // } finally {
    //   setIsDeletingAccount(false);
    // }
  };

  return (
    <main className="min-h-screen bg-app-gradient pt-10 pl-10">
      <div className="flex flex-col items-start">
        <Link
          href="/home"
          className={buttonStyle}
          style={{ fontFamily: "Georgia" }}
        >
          Back
        </Link>
        <button 
          className={buttonStyle} 
          style={{ fontFamily: "Georgia" }}
          // onClick={() => deleteAccount()}
        >
          Delete Account
        </button>
      </div>
      {/* <p className="text-2xl text-stone-800" style={{ fontFamily: "Georgia" }}>
        Settings Page...
      </p> */}
    </main>
  );
}
