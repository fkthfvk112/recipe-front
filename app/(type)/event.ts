export interface Event{
    eventId?:number;
    name:string;
    content:string;
    returnUrl:string;
    isActive:boolean;
    bannerImgUrl:string;
    contentImgUrl:string;
    rewardName:string;
    startAt:string;
    endAt:string;
}