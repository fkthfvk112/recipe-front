"use client";

import { useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useQueryClient } from "@tanstack/react-query";
import FridgeAiScanModal from "./FridgeAiScanModal";

interface Props {
  fridgeId: number;
  onSuccess?: () => void;
  className?: string;
  label?: string;
}

const defaultClassName =
  "inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white rounded-xl text-xs font-black shadow-xs transition-all border-none cursor-pointer outline-none";

export default function FridgeAiScanButton({
  fridgeId,
  onSuccess,
  className,
  label = "사진으로 넣기",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "fridgeDetail" && String(query.queryKey[1]) === String(fridgeId),
    });
    onSuccess?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className ?? defaultClassName}
      >
        <AutoAwesomeIcon sx={{ fontSize: 15 }} />
        <span>{label}</span>
      </button>
      <FridgeAiScanModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        fridgeId={fridgeId}
        onSuccess={handleSuccess}
      />
    </>
  );
}
