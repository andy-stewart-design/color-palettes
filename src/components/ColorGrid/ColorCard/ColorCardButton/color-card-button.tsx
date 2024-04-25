// "use client";

// import { motion } from "framer-motion";
// import { Locked, Unlocked } from "@/components/icons/16";
// import { useKeyColorContext } from "@/components/Providers";
// import classes from "./component.module.css";

// type PageProps = {
//   index: number;
//   keyIndex: {
//     current: number;
//     generated: number;
//   };
//   isActive: boolean;
// };

// export default function ColorCardButton({ index, isActive }: PageProps) {
//   const { updateKeyIndex, isLocked, toggleIsLocked } = useKeyColorContext();

//   const setKeyColor = () => updateKeyIndex(index);

//   return (
//     <>
//       {isActive && (
//         <motion.button
//           layoutId="key-index-button"
//           className={`${classes.button} ${classes.primary}`}
//           onClick={toggleIsLocked}
//           data-locked={isLocked ? "" : undefined}
//         >
//           <span>{isLocked ? <Locked /> : <Unlocked />}</span>
//           Key Color
//         </motion.button>
//       )}
//       {!isActive && !isLocked && (
//         <motion.button className={`${classes.button} ${classes.secondary}`} onClick={setKeyColor}>
//           Set Key
//         </motion.button>
//       )}
//     </>
//   );
// }
