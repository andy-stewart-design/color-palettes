"use client";

import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
// import { Locked, Unlocked } from "@/components/icons/16";
import Link from "next/link";
import cn from "clsx";
import { PARAMS } from "@/constants";
import classes from "./component.module.css";

type PageProps = {
  index: number;
  keyIndex: {
    current: string;
    default: string;
  };
  isActive: boolean;
};

export default function KeyIndexButton({ index, keyIndex, isActive }: PageProps) {
  const currentParams = useSearchParams();
  const nextParams = new URLSearchParams(currentParams);
  nextParams.set(PARAMS.index, String(index));

  return (
    <>
      {isActive && (
        <motion.button layoutId="key-index-button" className={cn(classes.button, classes.keyIndex)}>
          Key Index
        </motion.button>
      )}
      <AnimatePresence mode="popLayout" initial={false}>
        {!isActive && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Link
              className={cn(classes.button, classes.setIndex)}
              href={`/?${nextParams.toString()}`}
            >
              Set Index
            </Link>
          </motion.span>
        )}
      </AnimatePresence>
    </>
    // <>
    //   {isActive && (
    //     <motion.button
    //       layoutId="key-index-button"
    //       className={`${classes.button} ${classes.primary}`}
    //       onClick={toggleIsLocked}
    //       data-locked={isLocked ? "" : undefined}
    //     >
    //       <span>{isLocked ? <Locked /> : <Unlocked />}</span>
    //       Key Color
    //     </motion.button>
    //   )}
    //   {!isActive && !isLocked && (
    //     <motion.button className={`${classes.button} ${classes.secondary}`} onClick={setKeyColor}>
    //       Set Key
    //     </motion.button>
    //   )}
    // </>
  );
}
