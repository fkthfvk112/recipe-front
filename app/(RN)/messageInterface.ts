export type RNType = "BACK_PRESS"

export interface RNMessageInterface{
    type:RNType;
    data?:string;
}