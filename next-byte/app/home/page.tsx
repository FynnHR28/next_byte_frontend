"use client";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { TailSpin } from "react-loader-spinner";
import { User, getCurrentUser } from "@/api_client/user";
 
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null)
  const router = useRouter();

  const getUserData = async () => {
    setIsLoading(true);
    try {
      const user = await getCurrentUser();
      if (user) {
        setUserData(user);
      }
    } catch (err) {
      router.push('/auth/login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getUserData();
  }, [])

  return (
    <div className="p-10">
      {
        isLoading ? ( 
          <TailSpin
            visible={true}
            height="80"
            width="80"
            color="#F28C28"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <div>
            <p className="text-2xl text-stone-800" style={{ fontFamily: "Georgia" }}>
              Welcome {userData?.username}
            </p>
            <p className="text-sm text-stone-800" style={{ fontFamily: "Georgia" }}>
              Active since {userData?.created_at}
            </p>
          </div>
        )
      }
    </div>
  );
}
