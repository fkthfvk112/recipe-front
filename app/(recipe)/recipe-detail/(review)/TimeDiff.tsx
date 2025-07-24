"use client"

import { timeDifferenceString } from "@/app/(utils)/timeUtils"

export default function TimeDiff({ time }: { time: string }){
    return <span className="ms-2 text-[#a1a1a1]">· 약 {timeDifferenceString(new Date(time))}</span>
}