

export const minuteInterval = (minute:number, callback:(...param:any)=>any): ReturnType<typeof setInterval>=>{
    console.log("언터벌 설정");
    const intervalId = setInterval(()=>{
        console.log("언터벌 값나옴")
        callback();
    }, 1000*60*minute) 
// 1000*60*minute
    return intervalId;
}