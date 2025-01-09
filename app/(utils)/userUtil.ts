export const extractDeletedUser = (userNickName:string)=>{
    if(userNickName.includes("탈퇴한 유저_")){
        return userNickName.split("_")[0];
    }
    return userNickName;
}

export const isDeletedUser = (userNickName:string)=>{
    return userNickName.includes("탈퇴한 유저_");
}