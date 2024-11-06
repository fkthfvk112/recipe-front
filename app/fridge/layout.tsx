"use client"

import useChkLoginToken from "../(commom)/Hook/useChkLoginToken";

export default function fridgeLayout({
    children
}:{
    children: React.ReactNode;
}){
    return (
        <div className="defaultOuterContainer flex flex-col justify-start items-center">
            {children}
        </div>
    )
}