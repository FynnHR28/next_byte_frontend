import Link from "next/link";
import { buttonStyle, backButtonStyle } from "../styles";

const inputStyle = "bg-gray-50 text-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200";
const labelStyle = "text-gray-500 font-medium -mb-2";

export default function Login() {
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

        <div className="flex flex-col gap-4 mt-6">
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
          />

          <Link href="/home">
            <button className={buttonStyle} style={{ fontFamily: "Georgia" }}>
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}