import { useCallback, useRef, useState } from "react";

function oldSchoolCopy(text: string) {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
}

export function useCopyToClipboard(): [boolean, (value: string) => void] {
  // const [state, setState] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const timeoutID = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copyToClipboard = useCallback((value: string) => {
    async function handleCopy(value: string) {
      if (timeoutID.current) clearTimeout(timeoutID.current);
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        // setState(value);
        setShowSuccess(true);
        timeoutID.current = setTimeout(() => setShowSuccess(false), 2000);
      } else {
        oldSchoolCopy(value);
        // setState(value);
        setShowSuccess(true);
        timeoutID.current = setTimeout(() => setShowSuccess(false), 2000);
      }
    }

    handleCopy(value);
  }, []);

  return [showSuccess, copyToClipboard];
}
