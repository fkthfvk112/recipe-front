export interface Fridge{
    fridgeId:number;
    designType:string;
    name:string;
    description:string;
    maxSize:number;
    fridgeItems:FridgeItem[];
    updatedAt:string;
    createdAt:string;
}


export interface FridgeIdNameDesc{
    fridgeId:number;
    fridgeName:string;
    description:string;
    recommendRecipeFlag?:boolean;
}

export interface MyFridge extends FridgeIdNameDesc{
    expIngreCnt:number;
    normalIngreCnt:number;
}

export interface FridgeItem{
    fridgeItemId?:number;
    fridgeImgId?:number;
    imgUrl:string;
    expiredAt?:string;
    name:string;
    qqt?:string;
    description?:string;
    itemOrder?:number;
    createdAt?:string;
}




