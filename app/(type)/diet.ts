export interface DietItem{
    title:string|undefined;
    calorie:number|undefined;
    qqt:string|undefined;
    memo:string|undefined;
}

export interface DietItemRow{
    title:string|undefined;
    photo:string;
    dietItemList:DietItem[];
}

export interface DietDay{
    userId?:string;
    dietDayId?:string;
    title:string|undefined;
    memo:string|undefined;
    isPublic:boolean;
    dietItemRowList:DietItemRow[];
    createdAt?:string|undefined;
}
