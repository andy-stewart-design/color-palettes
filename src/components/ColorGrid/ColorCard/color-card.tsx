// "use client";

// import { forwardRef } from "react";
// import { motion } from "framer-motion";
// import ColorCardButton from "./ColorCardButton";
// import { useKeyColorContext } from "@/components/Providers";
// import classes from "./component.module.css";

// type PageProps = {
//   color: string;
//   name: number;
//   index: number;
//   numItems: number;
// };

// const ColorCard = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
//   const { color, index, numItems, name } = props;
//   const { keyIndex } = useKeyColorContext();
//   const isActive = index === keyIndex.current;
//   const boxShadow = `0 3px 8px -2px rgba(0 0 0 / ${
//     (index + 1) * 0.025 + 0.15
//   })`;

//   return (
//     <motion.div
//       ref={ref}
//       layout={true}
//       exit={{ opacity: 0, transition: { duration: 1 } }}
//       className={`${classes.card} color-card`}
//       data-state={isActive ? "on" : "off"}
//       style={{
//         "--background-color": color,
//         "--box-shadow": boxShadow,
//         zIndex: isActive ? 100000 : 30 - index,
//       }}
//     >
//       <motion.div key={numItems} layout="position" className={classes.hex}>
//         <span>
//           {name}: {color}
//         </span>
//       </motion.div>
//       <ColorCardButton index={index} keyIndex={keyIndex} isActive={isActive} />
//     </motion.div>
//   );
// });

// ColorCard.displayName = "ColorCard";

// export default ColorCard;
