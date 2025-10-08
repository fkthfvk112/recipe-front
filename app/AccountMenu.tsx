"use client"

import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import { deleteAuthToken, isAdmin } from "./(user)/signin/utils/authUtil";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { userFeedRecipeCacheSelectorAtom } from "./(recoil)/userFeedRecipeCacheSelector";
import { cacheKey } from "./(recoil)/cacheKey";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import KitchenIcon from '@mui/icons-material/Kitchen';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
  const [isAdminChk, setIsAdmin] = useState<boolean>(false);

  const likeRecipeReset = useResetRecoilState(userFeedRecipeCacheSelectorAtom(cacheKey.user_feed_like_recipe_key + "myFeedRecipe"));

  const router = useRouter();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if(isMobile){
      router.push("/accountMenuList");
    }else{
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToMyFeed = async () => {
    router.push(`/userfeed/myfeed`);
  };

  const goToCreatMyDiet = ()=>{
    router.push(`/diet/mydiet/create`);
  }

  const goToLikeRecipe = ()=>{
    likeRecipeReset();
    router.push(`/mylike/recipe`);
  }

  const goToAdminPage = ()=>{
    router.push(`/admin/ingredient`);
  }

  const goToMyRefridge = ()=>{
    router.push(`/fridge`)
  }

  useEffect(()=>{
    isAdmin().then((res)=>{
        if(res === true){
            setIsAdmin(true);
        }
    })
  }, [])

  return (
    <>
      <div>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{ width: 43, height: 43 }}
        >
          <Avatar sx={{ width: 43, height: 43 }}>Me</Avatar>
        </IconButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            goToMyFeed();
          }}
        >
        <Avatar /> 나의 레시피/식단
        </MenuItem>
        <MenuItem onClick={()=>{
          handleClose();
          goToCreatMyDiet();
        }}>
          <RestaurantIcon className="me-3"/> 식단 작성
        </MenuItem>
        
        <MenuItem onClick={()=>{
          handleClose();
          goToMyRefridge();
        }}>
          <KitchenIcon className="me-3"/> 나의 냉장고
        </MenuItem>

        <MenuItem onClick={()=>{
          handleClose();
          goToLikeRecipe();
        }}>
          <BookmarkAddedIcon className="me-3"/> 찜한 레시피
        </MenuItem>


        {
        isAdminChk&&
        <MenuItem onClick={()=>{
          goToAdminPage();
        }}>
          <BookmarkAddedIcon className="me-3"/> 어드민 페이지
        </MenuItem>
        }


        <Divider />
          <MenuItem onClick={()=>{
          handleClose();
          router.push("/welcome");
        }}>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          서비스 소개
        </MenuItem>      
        <MenuItem onClick={()=>{
          handleClose();
          router.push("/accountSetting");
        }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          계정설정
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            deleteAuthToken(); //server sid job
            setIsSignIn(false);
            router.push("/");
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          로그아웃
        </MenuItem>
      </Menu>
    </>
  );
}
