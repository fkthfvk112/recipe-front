"use client"

import UserInfoSetting from "./UserInfoSetting";
import UserInfoSetting_cantChg from "./UserInfoSetting_cantChg";

function UserSetting(){
    return(
        <div className="max-w-3xl w-dvw m-3 mt-10 flex flex-col justify-start items-center">
            <section className="w-full grid grid-cols-2 mt-10">
                <div className="col-span-2">
                    {/* <UserInfoSetting/> */}
                    <UserInfoSetting_cantChg/>
                </div>
            </section>
        </div>
    )
}


export default UserSetting;