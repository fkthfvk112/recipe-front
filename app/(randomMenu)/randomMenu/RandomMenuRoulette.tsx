import React, { useEffect, useState } from 'react';
import Image from "next/image";

const getCssItemDesign = (inx: number, rotation:number, rotationTime:number) => {
    const isActive = (rotation / 60) % 6 === inx;
    return {
        width: "120px",
        height: "120px",
        position: "absolute" as "absolute",
        transform: `rotateY(${rotation + 60 * -inx}deg) translateZ(100px)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "24px",
        border: "1px solid #fff",
        transition: `transform ${rotationTime}s ease, opacity ${rotationTime}s ease`,
    };
};

export default function RandomMenuRoulette({startRotate, rotationTime}:{startRotate:number, rotationTime:number}) {
    const [rotation, setRotation] = useState<number>(0);

    const rotateItem = ()=>{
        const randomIndex = Math.floor(Math.random() * 6);
        setRotation((prev)=>prev+1200 + randomIndex * 60);
    }

    useEffect(()=>{
        rotateItem();
    }, [startRotate])

    const menuItems = [0, 1 ,2 ,3 ,4 ,5].map((inx) => {
        return (
        <div key={inx} style={getCssItemDesign(inx, rotation, rotationTime)}>
            <Image className="inner-img" width={120} height={120} src={`/randomImages/menu${inx}.png`} alt="no imgage"/>
            {inx}
        </div>
        );
    });

    return (
        <div style={{ perspective: "1000px", width: "300px", height: "200px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {menuItems}
            </div>
        </div>
    );
}
