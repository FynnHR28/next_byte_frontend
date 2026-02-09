"use client";
import { request } from "@/api_client/api_request";
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { TailSpin } from "react-loader-spinner";

interface UserData {
    username: string;
    created_at: string;
}
 
export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null)

    useEffect(() => {
        async function fetch_user_data() {
            try {
                const response = await request({
                    query: `
                        query getMe {
                            me {
                                username,
                                created_at
                            }
                        }
                    `
                })
                console.log(response.data.me)
                // Unpack the username and created at fields into this client side object
                setUserData({...response.data.me})
            }
            catch (err){
                console.log(err);
                router.push('/')
            }
            finally {
                setIsLoading(false)
            }
        } 
        fetch_user_data()
        
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
