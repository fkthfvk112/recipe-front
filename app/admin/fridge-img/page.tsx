"use client";

import ImgMgmt from "./ImgMgmt";
import ImgUpload from "./ImgUpload";

export default function FridgeImg(){

    return (
        <div className="flex flex-col justify-start items-center w-full min-h-lvh p-5">
            <ImgUpload></ImgUpload>
        <div className="top-line w-full"/>
            <ImgMgmt></ImgMgmt>
    </div>
    )
}