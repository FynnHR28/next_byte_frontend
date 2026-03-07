"use client";
import { queryMe } from '@/api_client/users'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { User, ShieldUser, Calendar, MailQuestion, MailCheckIcon, LucideSendHorizonal,SendIcon } from 'lucide-react'
import Avatar from "boring-avatars";
import { AnimatePresence, motion } from "motion/react";
import { MotionButton } from "@/components/motion/clickables";
import { MotionHiddenMsgDiv, PulseDiv } from "@/components/motion/containers";
import { TailSpin } from "react-loader-spinner";
import ReForm from "@/components/userInput/reusableForm";
import { Input } from "@/components/userInput/reusableInput";
import { sendVerificationEmail } from '@/api_client/user';
import { div } from 'motion/react-client';

const inputStyle = "bg-gray-50 text-gray-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-200 w-full";
const labelStyle = "text-stone-700 font-medium";

type UserProfile = {
    id: number;
    username:string;
    email: string;
    created_at: string;
    country:string;
    state: string;
    city: string;
    zipcode: BigInteger;
    role:string;
    is_verified:boolean
}

export default function Profile() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [isSendingEmail, setIsSendingEmail ] = useState(false);

    useEffect(() => {
        const fetchProfile = async() => {
            try {
            const userProfileData = await queryMe(['username','email','created_at','state','city','country', 'role', 'is_verified']);
            // Unpack the requestedfields
            console.log(userProfileData)
            setUserProfile({...userProfileData});
            }
            catch (err){
                router.push('/')
            }
            finally {
                setIsLoading(false)
            }       
        }
        fetchProfile();
        
    }, [])

    const handleEmailSend = async () => {
        setIsSendingEmail(true);
        const response = await sendVerificationEmail(userProfile!.email);
        console.log(response);
        setIsSendingEmail(false);
    }
    
    return (
    <AnimatePresence>
        <motion.div className=" w-full gap-5 bg-app flex flex-col" style={{ fontFamily: "Georgia"}}>
            
            <motion.div transition={{ duration: 1.5}} initial={{ opacity: 0}} animate={{opacity: 1}} className=" flex flex-col sm:flex-row w-full gap-4 h-screen">
                <div className="p-10 w-full sm:w-1/3 flex-col flex gap-6  items-center justify-start gap-10">
                    {/*Some high level user profile details*/}
                   
   
                    <p className="flex justify-center items-center w-full gap-2 font-bold text-amber-800 lg:text-6xl text-4xl" >
                    {userProfile?.username}   {userProfile?.role.includes('admin') ? <ShieldUser size={20} color="orange"/> : <User/>}
                    </p>
                    {/* Avatar placeholder */}
                    <PulseDiv>
                        <Avatar 
                            name={userProfile?.username}
                            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
                            variant="beam"
                            size={200}
                        />
                    </PulseDiv>
               

                    <div className="sm:pb-20 p-10 flex items-center w-full flex-col gap-2 lg:text-lg md:text-lg sm:text-sm text-xs">
                        <p className="flex flex items-center gap-2 text-stone-600">
                            <Calendar color="orange"/>  
                                Nextbyte {userProfile?.role.includes('admin') ? 
                                <span className="font-bold">Administrator </span> 
                                : <span className="font-bold">User </span>} 
                            </p>
                        <div className="flex gap-2"> 
                            {
                                userProfile?.is_verified ? 
                                    <MailCheckIcon color="orange" />
                                : 
                                (<motion.div initial={{ y: -20 }} animate={{ y: 0 }}
                                    transition={{ type: "spring", bounce:0.75, duration:1}}
                                  >
                                    <MotionHiddenMsgDiv
                                        hiddenElement={
                                            !isSendingEmail ? (
                                                <div className="flex items-center text-xs text-stone-800 w-[150px]">
                                                    
                                                    Click here to recieve a verification email!
                                                    <motion.button 
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.8 }}
                                                        className="text-orange-300 hover:cursor-pointer" onClick={() => handleEmailSend()}>
                                                        <SendIcon scale={0.5}/>
                                                    </motion.button>
                                                </div>
                                            ) :
                                            (
                                                <div className="flex items-center text-xs text-stone-800 w-[150px]">
                                                   <TailSpin color='orange' width={30} />
                                                </div>
                                            )
                                            
                                        }
                                    >
                                        <MailQuestion color="orange"/>
                                    </MotionHiddenMsgDiv>
                                  </motion.div>)
                            }
                            {userProfile?.email}  
                    
                        </div>
                    </div>
                    
                    {/*END*/}
                
                </div>
                
                
                <div className="m-10 flex-col gap-20 p-10 w-full sm:w-2/3 rounded-xl ">
                   <h1 className="m-10">PLACEHOLDER FOR EDITABLE FORM</h1>
                   <div className='flex gap-10 flex-wrap'>
                        {Object.entries(userProfile || {}).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                                <p className="">{key}</p>
                                <p className="">{value}</p>
                            </div>
                        ))}
                   </div>
                   
                </div>
                
            </motion.div>
                
        </motion.div>
    </AnimatePresence>
    );

}