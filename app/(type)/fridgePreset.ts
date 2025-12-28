export interface FridgePresetPreview {
  fridgePresetId:number;
  name:string;
  presetSort:string;
  description:string;
  items:FrdgePresetItemPreview[];
}

export interface FrdgePresetItemPreview {
  fridgeItemPresetId:number;
  sortOrder:number;
  imgUrl:String;
  ingreName:String;
}