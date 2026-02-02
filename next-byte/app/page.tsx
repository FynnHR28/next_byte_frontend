import Image from "next/image";
import Link from "next/link";
import { auth_request } from "@/api_client/api_request";


const buttonStyle = 
"bg-gradient-to-tr from-stone-200 to-neutral-300 w-40 h-sm rounded-full text-black px-4 py-2 rounded \
hover:outline hover:outline-3 hover:outline-orange-300 hover:scale-102 ease-in-out";

export default function Home() {


  return (
    <main className="flex min-h-screen justify-center items-center bg-app-gradient">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/nextbyte_animated.gif"
          alt="NextByte Logo"
          width={180}
          height={180}
        />
        <h1
          className="text-6xl font-bold text-black"
          style={{ fontFamily: "Georgia" }}
        >
          NextByte
        </h1>
        
        <div className="flex gap-8 p-6">
          <Link href="/auth/login">
            <button className={buttonStyle} style={{ fontFamily: "Georgia" }}>
              Sign In
            </button>
          </Link>
          <Link href="/auth/create">
            <button className={buttonStyle} style={{ fontFamily: "Georgia" }}>
              Create Account
            </button>
          </Link>

        </div>
      </div>
    </main>
  );
}
