import { Avatar } from "@mui/material";
import Image from "next/image";

export default function MyFeedPhoto({
  photoUrl,
}: {
  photoUrl: string | undefined | null;
}) {
  const image = photoUrl ? (
    <Image
      className="rounded-full"
      src={photoUrl ? photoUrl : ""}
      alt="no img"
      fill
    ></Image>
  ) : (
    <Avatar className="w-full h-full" src="/broken-image.jpg" />
  );

  return <div className="img-wrapper-round w-[120px] h-[120px]">{image}</div>;
}
