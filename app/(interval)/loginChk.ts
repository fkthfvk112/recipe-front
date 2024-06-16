

export const minuteInterval = (minute:number, callback:(...param:any)=>any): ReturnType<typeof setInterval>=>{
    const intervalId = setInterval(()=>{
        callback();
    }, 1000*60*minute) 
// 1000*60*minute
    return intervalId;
}