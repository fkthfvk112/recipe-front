"use client";

import Image from "next/image";
import CommonModal from "./CommonModal";

export default function ImgModal({
  modalOpen,
  setModalOpen,
  modalImg,
}: {
  modalOpen: boolean;
  setModalOpen: (data: any) => any;
  modalImg: string;
}) {
  return (
    <CommonModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      maxWidthClass="max-w-2xl"
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-50">
        <Image
          className="object-contain"
          fill
          src={modalImg}
          alt="modal image"
          quality={95}
          priority
        />
      </div>
    </CommonModal>
  );
}