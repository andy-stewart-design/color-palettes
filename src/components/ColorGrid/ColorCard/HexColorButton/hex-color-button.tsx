import { motion } from "framer-motion";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import classes from "./component.module.css";

type PropTypes = {
  color: string;
  name: number;
};

export default function HexColorButton({ color, name }: PropTypes) {
  const [showSuccess, copyToClipboard] = useCopyToClipboard();

  return (
    <motion.button onClick={() => copyToClipboard(color)} layout="position" className={classes.hex}>
      <span>{showSuccess ? "Copied!" : `${name}: ${color}`}</span>
    </motion.button>
  );
}
