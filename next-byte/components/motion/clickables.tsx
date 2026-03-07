"use client";
import { AnimatePresence, motion } from "motion/react";
import { dialog } from "motion/react-client";
import { ReactNode, ReactElement, useState } from "react";

// Work in progress
type MotionButtonProps = {
    text?:string,
    childElem?: ReactElement,
    onClick?: Event
}
interface funct {
  (data: string): void
}
export function MotionButton({ text, childElem, onClick }:MotionButtonProps) {
  const [disabled, setDisabled ] = useState(true);
  return (
    <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        disabled={disabled}
        onClick={() => onClick()}
    >
        {text?? ""} {childElem?? ""}
    </motion.button>
  )
}
