"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { setCookie, deleteCookie, getCookie } from "cookies-next";

const Navbar = () => {
  return (
    <>
      <div className="w-full h-20 bg-emerald-800 sticky top-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <span>로고</span>
            <ul className="hidden md:flex gap-x-6 text-white">
              <li>
                <Link href="/about">
                  <p>About Us</p>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <p>Services</p>
                </Link>
              </li>
              <li>
                <Link href="/contacts">
                  <p>Contacts</p>
                </Link>
              </li>
            </ul>
            <button>로그인/아웃</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
