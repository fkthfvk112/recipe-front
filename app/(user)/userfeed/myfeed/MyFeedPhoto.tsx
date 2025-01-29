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
    <Avatar sx={{width:100, height:100}} src="/broken-image.jpg" />
  );

  return <div className="img-wrapper-round w-[100px] h-[100px]">{image}</div>;
}
