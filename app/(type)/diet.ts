export interface DietItem{
    title:string|undefined;
    calorie:string|undefined;
    qqt:string|undefined;
    memo:string|undefined;
    photo:string|undefined;
}

export interface DietItemRow{
    title:string|undefined;
    dietItemList:DietItem[];
}

export interface DietDay{
    title:string|undefined;
    memo:string|undefined;
    isDel:string;
    isPublic:boolean;
    dietIemRowList:DietItemRow[];
}