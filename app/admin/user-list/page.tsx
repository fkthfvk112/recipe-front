"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { axiosAuthInstacne, defaultAxios } from "@/app/(customAxios)/authAxios";
import { IngredientList } from "@/app/(type)/ingredient";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import styles from "./adminUser.module.css"

interface userInfo{
    userId:string;
    nickName:string;
    email:string;
    grantType:string;
    blockEnum?:"UNBLOCK"|"CREATE_BLOCK_RECIPE_BOARD"|"CREATE_BLOCK_ALL"|"LOGIN_BLOCKED",
    createDate:string;
}

interface userSearchDTO{
    userId?:string;
    nickName?:string;
    email?:string;
    grantType?:string;
    blockEnum?:"UNBLOCK"|"CREATE_BLOCK_RECIPE_BOARD"|"CREATE_BLOCK_ALL"|"LOGIN_BLOCKED",
    dateFrom?:string;
    dateTo?:string;
}

export default function UserListAdmin(){
    const [userSearch, setUserSearch] = useState<userSearchDTO>();
    const [userInfo, setUserInfo] = useState<userInfo[]>([]);



    useEffect(()=>{
        axiosAuthInstacne
            .get(`admin/user/list`, {
                params:userSearch
            })
            .then((res)=>{
                console.log("레슽", res.data)
                setUserInfo(res.data);
            });
    }, [])

    const searchUser = ()=>{
        console.log("파람", userSearch);

        axiosAuthInstacne
        .get(`admin/user/list`, {
            params:userSearch
        })
        .then((res)=>{
            console.log("레슽", res.data)
            setUserInfo(res.data);
        });
    }

    const setSearchDate = (evt:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>)=>{
        const name  = evt.target.name;
        const value = evt.target.value;
        
        setUserSearch((prevSearch) => ({
            ...prevSearch,
            [name]: value,
        }));


        console.log("이거", userSearch)
    }

    const userList = userInfo.map((user, inx)=>{
        let blockColor = '';
        switch(user.blockEnum){
            case "UNBLOCK":
                blockColor = '#03fc17';
                break;
            case "CREATE_BLOCK_RECIPE_BOARD":
                blockColor = '#fcd703';
                break;
            case "CREATE_BLOCK_ALL":
                blockColor = "#fc9d03";
                break;
            case "LOGIN_BLOCKED" :
                blockColor = "#fc3903";
                break;
        }
        return (
            <tr key={inx}>
               <td>{user.userId}</td>
               <td>{user.nickName}</td>
               <td>{user.email}</td>
               <td>{user.grantType}</td>
               <td>{user.createDate}</td>
               <td className={`bg-[${blockColor}]`}>
                {user.blockEnum}</td>
            </tr>
        )
    })
    return (
        <div className="flex flex-col justify-start items-center w-full min-h-lvh p-5">
            <section className="w-full mb-20">
                <TitleDescription title="유저 목록" desc={"가입한 유저 목록 확인"}/>
                <section className="w-full overflow-y-scroll">
                    <table className={`w-full ${styles.searchTalble}`}>
                        <tr>
                            <td>
                                <span className="w-[150px] font-bold">유저 아이디</span>
                            </td>
                            <td>
                                <input name="userId" onChange={(evt)=>{setSearchDate(evt)}} type="text" value={userSearch?.userId} />
                            </td>
                            <td>
                                <span className="w-[150px] font-bold">유저 닉네임</span>
                            </td>
                            <td>
                                <input name="nickName" onChange={(evt)=>{setSearchDate(evt)}} type="text" value={userSearch?.nickName} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span className="w-[150px] font-bold">유저 이메일</span>
                            </td>
                            <td>
                                <input name="email" onChange={(evt)=>{setSearchDate(evt)}} type="text" value={userSearch?.email} />
                            </td>
                            <td>
                                <span className="w-[150px] font-bold">회원가입 타입</span>
                            </td>
                            <td>
                                <input name="grantType" onChange={(evt)=>{setSearchDate(evt)}} type="text" value={userSearch?.grantType} />
                            </td>
                        </tr>
                        <tr> 
                            <td className="font-bold">
                                상태
                            </td>
                            <td>
                                <select name="blockEnum" onChange={(evt)=>{setSearchDate(evt)}}>
                                    <option value="UNBLOCK">정상</option>
                                    <option value="CREATE_BLOCK_RECIPE_BOARD">레시피, 게시판 글쓰기 금지</option>
                                    <option value="CREATE_BLOCK_ALL">전체 글쓰기 금지</option>
                                    <option value="LOGIN_BLOCKED">로그인 금지</option>

                                </select>
                            </td>
                            <td>
                                <span className="w-[150px] font-bold">회원가입 일자</span>
                            </td>
                            <td className="flex justify-center items-center w-full">
                                <input name="dateFrom" onChange={(evt)=>{setSearchDate(evt)}} type="date" value={userSearch?.dateFrom} />
                                <span className="mx-2">~</span>
                                <input name="dateTo" onChange={(evt)=>{setSearchDate(evt)}} type="date" value={userSearch?.dateTo}/>
                            </td>
                        </tr>
                    </table>
                </section>
                <div className="w-full text-center mt-3 mb-10">
                    <button onClick={()=>searchUser()} className="greenBtn">조회</button>
                </div>
                <table className="w-full text-center">
                    <tr className="bg-[#c4dee9] font-bold">
                        <td>아이디</td>
                        <td>닉네임</td>
                        <td>이메일</td>
                        <td>회원가입 타입</td>
                        <td>회원가입 일자</td>
                        <td>상태</td>
                    </tr>
                    {userList}
                </table>
            </section>
        </div>
    )
}