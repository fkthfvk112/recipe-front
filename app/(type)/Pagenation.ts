export interface IndexPagenation<T1, T2>{
    data: T1;
    index: T2;
    isEnd: boolean;
}

export interface PageSizePagenation<T>{
    data: T;
    page:number;
    size:number;
}