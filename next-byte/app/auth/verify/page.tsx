"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyUserEmail } from "@/api_client/user";
import { TailSpin } from "react-loader-spinner";


export default function Verify() {
    const router = useRouter(); 
    const searchParams = useSearchParams();

    const verifyToken = searchParams.get("verify-token");

    if(!verifyToken) router.push('/')

    useEffect(() => {
        const sendVerificationToken = async() => {
            try {
                const response = await verifyUserEmail(verifyToken!);
                router.push('/home/profile');
            }
            catch (err){
                router.push('/')
            };
        }
        sendVerificationToken();
        
    }, []);


    return (
    <main className="flex flex-col gap-10 min-h-screen justify-center items-center bg-app-gradient">
        <p className="text-3xl text-stone-700">Verifying...</p>
        <TailSpin color="orange" width={200}/>

    </main>
    )
}
