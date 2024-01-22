import { Avatar } from "@mui/material";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

export default function MyFeedPhoto({
  photoUrl,
}: {
  photoUrl: string | undefined | null;
}) {
  const image = photoUrl ? (
    <Image
      style={{
        objectFit: "cover",
      }}
      fill
      src={photoUrl ? photoUrl : ""}
      alt="no img"
    ></Image>
  ) : (
    <Avatar className="w-full h-full" src="/broken-image.jpg" />
  );

  return <div className="rounded-full w-28 h-28">{image}</div>;
}
