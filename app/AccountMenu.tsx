"use client"

import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { useRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import { deleteAuthToken } from "./(user)/signin/utils/authUtil";
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSignIn, setIsSignIn] = useRecoilState(siginInState);

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
          <Avatar /> 내 피드
        </MenuItem>
        <MenuItem onClick={()=>{
          handleClose();
          goToCreatMyDiet();
        }}>
          <RestaurantIcon className="me-3"/> 식단 작성
        </MenuItem>
        <Divider />
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
            router.refresh();
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
