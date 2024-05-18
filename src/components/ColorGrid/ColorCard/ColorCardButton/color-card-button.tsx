"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
// import { Locked, Unlocked } from "@/components/icons/16";
import { PARAMS } from "@/constants";
import Link from "next/link";
import classes from "./component.module.css";

type PageProps = {
  index: number;
  keyIndex: {
    current: string;
    default: string;
  };
  isActive: boolean;
};

export default function ColorCardButton({ index, keyIndex, isActive }: PageProps) {
  const currentParams = useSearchParams();
  const nextParams = new URLSearchParams(currentParams);
  nextParams.set(PARAMS.index, String(index));

  return (
    <Link href={`/?${nextParams.toString()}`}>{isActive ? "Current" : "Set"} Index</Link>
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
