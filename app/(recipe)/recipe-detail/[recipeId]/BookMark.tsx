"use client";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { siginInState } from "@/app/(recoil)/recoilAtom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function BookMark({ recipeId }: { recipeId: number }) {
  const isSignIn = useRecoilValue<boolean>(siginInState);

  const [resetData, setResetData] = useState<number>(0);
  const [isOn, setIsOn] = useState<boolean>(false);

  useEffect(() => {
    if (isSignIn) {
      axiosAuthInstacne
        .get(`like/recipe/like-state?recipeId=${recipeId}`)
        .then((res) => {
          setIsOn(res.data?.isOn);
        });
    }
  }, [resetData]);

  const handleBookMarkClick = () => {
    if (isSignIn) {
      axiosAuthInstacne
        .post("like/recipe/toggle", {
          recipeId: recipeId,
        })
        .then((res) => {
          setResetData(resetData + 1);
        });
    } else {
      // have to 리다이렉트?
      //alert("로그인을 해주세요.");
    }
  };

  const bookMark = isOn ? (
    <BookmarkAddedIcon sx={{ fontSize: 30, color: '#FF7043', transition: 'all 0.2s' }} />
  ) : (
    <BookmarkBorderOutlinedIcon sx={{ 
      fontSize: 30, 
      color: '#9CA3AF', 
      transition: 'all 0.2s', 
      '&:hover': { 
        color: '#FF7043',
        transform: 'scale(1.1)'
      } 
    }} />
  );
  return (
    <button
      onClick={handleBookMarkClick}
      className="w-10 h-10 flex justify-center items-center border-none bg-transparent p-0 cursor-pointer focus:outline-none hover:scale-105 transition-transform"
    >
      {bookMark}
    </button>
  );
}
