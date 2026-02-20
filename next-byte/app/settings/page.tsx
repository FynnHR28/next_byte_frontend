'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deactivateAccount } from "@/api_client/user";

const buttonStyle = "text-xl text-stone-600 hover:text-stone-800 bg-white rounded-full px-4 py-2 shadow-md hover:shadow-lg hover:scale-102 ease-in-out mb-6 cursor-pointer";

export default function Settings() {
  const router = useRouter(); 
  const [error, setError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const deleteAccount = async () => {
    setError("");
    setIsDeletingAccount(true);

    try {
      await deactivateAccount();
      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setIsDeletingAccount(false);
    }
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

        {error ? (
          <p className="text-sm text-red-600" style={{ fontFamily: "Verdana" }}>
            {error}
          </p>
        ) : null}

        <button 
          className={buttonStyle} 
          style={{ fontFamily: "Georgia" }}
          onClick={() => deleteAccount()}
          disabled={isDeletingAccount}
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
