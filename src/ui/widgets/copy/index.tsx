import { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import CopyIcon from "@/svgs/copy";

interface TProps {
  text: string;
}

const Copy = ({ text }: TProps) => {
  const [copy, setCopy] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopy(true);
  };

  useEffect(() => {
    if (copy) {
      setTimeout(() => {
        setCopy(false);
      }, 1000);
    }
  }, [copy]);

  return (
    <>
      {!copy && <CopyIcon className="text-base cursor-pointer text-black hover:text-[#C9D064]" onClick={copyToClipboard} />}
      {copy && <CheckIcon className="w-4 h-4 color-[#C9D064]" />}
    </>
  );
};

export default Copy;
