import Image from "next/image";

const buttonStyle = 
"bg-gradient-to-tr from-cyan-200 to-sky-300 w-40 h-sm rounded-full text-black px-4 py-2 rounded font-bold" +
"hover:outline hover:outline-3 hover:outline-orange-300 hover:scale-102 ease-in-out";

export default function Home() {
  return (
    <main className="flex min-h-screen mb-auto justify-center items-center bg-gradient-to-br from-orange-200 via-white to-sky-200">
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
          <button className={buttonStyle} style={{ fontFamily: "Georgia" }}>
            Sign In
          </button>
          <button className={buttonStyle} style={{ fontFamily: "Georgia" }}>
            Create Account
          </button>
        </div>
      </div>
    </main>
  );
}
