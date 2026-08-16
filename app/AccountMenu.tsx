"use client";

import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { siginInState } from "./(recoil)/recoilAtom";
import { deleteAuthToken, isAdmin } from "./(user)/signin/utils/authUtil";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { userFeedRecipeCacheSelectorAtom } from "./(recoil)/userFeedRecipeCacheSelector";
import { cacheKey } from "./(recoil)/cacheKey";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import KitchenIcon from "@mui/icons-material/Kitchen";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [, setIsSignIn] = useRecoilState(siginInState);
  const [isAdminChk, setIsAdmin] = useState<boolean>(false);

  const likeRecipeReset = useResetRecoilState(
    userFeedRecipeCacheSelectorAtom(cacheKey.user_feed_like_recipe_key + "myFeedRecipe")
  );

  const router = useRouter();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      router.push("/accountMenuList");
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToMyFeed = async () => {
    router.push(`/userfeed/myfeed`);
  };

  const goToCreatMyDiet = () => {
    router.push(`/diet/mydiet/create`);
  };

  const goToLikeRecipe = () => {
    likeRecipeReset();
    router.push(`/mylike/recipe`);
  };

  const goToAdminPage = () => {
    router.push(`/admin/ingredient`);
  };

  const goToMyRefridge = () => {
    router.push(`/fridge`);
  };

  const goToMyFridgeItemTx = () => {
    router.push(`/fridge/tx-history`);
  };

  useEffect(() => {
    isAdmin().then((res) => {
      if (res === true) {
        setIsAdmin(true);
      }
    });
  }, []);

  return (
    <>
      <div>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          className="transition-transform active:scale-95"
          sx={{ width: 42, height: 42, p: 0 }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: "#10b981",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: 800,
              boxShadow: "0 2px 8px rgba(16,185,129,0.25)",
            }}
          >
            ME
          </Avatar>
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
            borderRadius: "20px",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(229, 231, 235, 0.8)",
            mt: 1.5,
            p: 1,
            minWidth: 200,
            "& .MuiMenuItem-root": {
              borderRadius: "12px",
              py: 1.2,
              px: 2,
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#374151",
              my: 0.2,
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor: "#ecfdf5",
                color: "#059669",
              },
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 18,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              borderTop: "1px solid rgba(229, 231, 235, 0.8)",
              borderLeft: "1px solid rgba(229, 231, 235, 0.8)",
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
          <ListItemIcon sx={{ color: "#10b981", minWidth: "32px !important" }}>
            <MenuBookIcon fontSize="small" />
          </ListItemIcon>
          나의 레시피/식단
        </MenuItem>

        {/* <MenuItem
          onClick={() => {
            handleClose();
            goToCreatMyDiet();
          }}
        >
          <ListItemIcon sx={{ color: "#10b981", minWidth: "32px !important" }}>
            <RestaurantIcon fontSize="small" />
          </ListItemIcon>
          식단 작성
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            handleClose();
            goToMyRefridge();
          }}
        >
          <ListItemIcon sx={{ color: "#10b981", minWidth: "32px !important" }}>
            <KitchenIcon fontSize="small" />
          </ListItemIcon>
          나의 냉장고
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            goToMyFridgeItemTx();
          }}
        >
          <ListItemIcon sx={{ color: "#10b981", minWidth: "32px !important" }}>
            <ReceiptLongIcon fontSize="small" />
          </ListItemIcon>
          식재료 소비 내역
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            goToLikeRecipe();
          }}
        >
          <ListItemIcon sx={{ color: "#10b981", minWidth: "32px !important" }}>
            <BookmarkAddedIcon fontSize="small" />
          </ListItemIcon>
          찜한 레시피
        </MenuItem>

        {isAdminChk && (
          <MenuItem
            onClick={() => {
              handleClose();
              goToAdminPage();
            }}
          >
            <ListItemIcon sx={{ color: "#d97706", minWidth: "32px !important" }}>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            어드민 페이지
          </MenuItem>
        )}

        <Divider sx={{ my: 1, borderColor: "#f3f4f6" }} />

        <MenuItem
          onClick={() => {
            handleClose();
            router.push("/welcome");
          }}
        >
          <ListItemIcon sx={{ color: "#6b7280", minWidth: "32px !important" }}>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          서비스 소개
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            router.push("/accountSetting");
          }}
        >
          <ListItemIcon sx={{ color: "#6b7280", minWidth: "32px !important" }}>
            <Settings fontSize="small" />
          </ListItemIcon>
          계정 설정
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            deleteAuthToken(); // server side job
            setIsSignIn(false);
            router.push("/");
            router.refresh();
          }}
          sx={{
            color: "#ef4444 !important",
            "&:hover": {
              backgroundColor: "#fef2f2 !important",
              color: "#dc2626 !important",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#ef4444", minWidth: "32px !important" }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          로그아웃
        </MenuItem>
      </Menu>
    </>
  );
}
