"use client";
import { AnimatePresence, motion } from "motion/react";
import { div } from "motion/react-client";
import { ReactNode, useState, cloneElement, ReactElement, Children } from "react";

type MotionHiddenMsgDivProps = {
    children:ReactNode
    hiddenElement:ReactElement<{ className?: string }>
}
export function MotionHiddenMsgDiv({ children, hiddenElement }: MotionHiddenMsgDivProps) {

    const [isHidden, setHidden] = useState(true);
    
    return (
        <AnimatePresence>
            <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{
                duration: 0.2
                }}
                className="-m-5 p-5"
                onMouseEnter={() => setHidden(false)}
                onMouseLeave={() => setHidden(true)}
            >
                {isHidden ? '' : (
                    <motion.div 
                    
                        className=" text-sm  p-5 fixed bg-white bottom-10 left-10 rounded-xl shadow-sm shadow-orange-100 "
                        style={{ fontFamily: "Georgia"}}
                    >
                        {hiddenElement}
                    </motion.div>   
                )
                }
                {children}
            </motion.div>
        </AnimatePresence>
    )
}


type PulseDivProps = {
    children:ReactElement
}
export function PulseDiv({children}:PulseDivProps) {
  return (
    <motion.div 
        animate={{ scale: [1, 1.02,1.04,1.06,1.08,1.1,1.12, 1.1,1.08,1.06,1.04,1.02,1] }} // Animate to an array of values (keyframes)
        transition={{
            repeat: Infinity, // Repeat the animation indefinitely
            repeatType: "loop", // Reverse the animation direction each cycle
            duration: 8, // Duration of one cycle (in seconds)
            ease: "easeIn", // Optional: Use linear easing for a consistent speed
        }} 
        className="w-full flex justify-center"
    >
        {children}
    </motion.div>
  )
}

