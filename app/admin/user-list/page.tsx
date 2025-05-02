"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { axiosAuthInstacne, defaultAxios } from "@/app/(customAxios)/authAxios";
import TitleDescription from "@/app/(commom)/Component/TitleDescription";
import styles from "./adminUser.module.css"
import UserDetailModal from "./UserDetailModal";
import BanModal from "./BanModal";
import { PieChart, pieChart } from "./PieChart";

interface userInfo{
    userId:string;
    nickName:string;
    email:string;
    grantType:string;
    blockEnum?:"UNBLOCK"|"CREATE_BLOCK_RECIPE_BOARD"|"CREATE_BLOCK_ALL"|"LOGIN_BLOCKED",
    gender:string;
    birthDate:string;
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
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [banModalOpen, setBanModalOpen] = useState<boolean>(false);

    const [selectedUser, setSelectedUser] = useState<string>("");

    const [pieGenderChartData, setGenderpieChartData] = useState<pieChart[]>([]);

    const [ageRangeData, setAgeRangeData] = useState<pieChart[]>([]);


    const setGenderPieData = (userData:userInfo[])=>{
        let maleCnt = 0;
        let femaleCnt = 0;
        userData.forEach((data)=>{
            if(data.gender.toLowerCase() === 'm') maleCnt++;
            else if(data.gender.toLowerCase() === 'f') femaleCnt++;
        })

        setGenderpieChartData([
            {
                id:"남성",
                label:"남성",
                value:maleCnt,
                color:"#90CAF9"
            },
            {
                id:"여성",
                label:"여성",
                value:femaleCnt,
                color:"#FFC0CB"    
            }
        ])
    }

    const getAgeFromBirthDate = (birthDate: string): number => {
        const birthYear = parseInt(birthDate.substring(0, 4), 10);
        const birthMonth = parseInt(birthDate.substring(4, 6), 10);
        const birthDay = parseInt(birthDate.substring(6, 8), 10);
        
        const today = new Date();
        const age = today.getFullYear() - birthYear;
        
        // 생일이 지나지 않았으면 나이를 하나 빼야 함
        const hasBirthdayPassed = today.getMonth() + 1 > birthMonth || 
                                  (today.getMonth() + 1 === birthMonth && today.getDate() >= birthDay);
        
        return hasBirthdayPassed ? age : age - 1;
    };

    const setAgeRangePieDate = (userData:userInfo[])=>{
        const ageGroups = {
            '15-20': 0,
            '20-25': 0,
            '25-30': 0,
            '30-35': 0,
            '35-40': 0,
            '40-45': 0,
            '45-50': 0,
            '50+': 0
          };

          userData.forEach(data => {
            const age = getAgeFromBirthDate(data.birthDate);
        
            if (age >= 15 && age < 20) ageGroups['15-20']++;
            else if (age >= 20 && age < 25) ageGroups['20-25']++;
            else if (age >= 25 && age < 30) ageGroups['25-30']++;
            else if (age >= 30 && age < 35) ageGroups['30-35']++;
            else if (age >= 35 && age < 40) ageGroups['35-40']++;
            else if (age >= 40 && age < 45) ageGroups['40-45']++;
            else if (age >= 45 && age < 50) ageGroups['45-50']++;
            else if (age >= 50) ageGroups['50+']++;
          });

          setAgeRangeData([
            {
                id:'15-20',
                label:'15-20',
                value:ageGroups['15-20'],
                color:"#90CAF9"
            },
            {
                id:'20-25',
                label:'20-25',
                value:ageGroups['20-25'],
                color:"#90CAF9"
            },
            {
                id:'20-25',
                label:'20-25',
                value:ageGroups['20-25'],
                color:"#90CAF9"
            },
            {
                id:'30-35',
                label:'30-35',
                value:ageGroups['30-35'],
                color:"#90CAF9"
            },
            {
                id:'30-35',
                label:'40-45',
                value:ageGroups['40-45'],
                color:"#90CAF9"
            },
            {
                id:'45-50',
                label:'45-50',
                value:ageGroups['45-50'],
                color:"#90CAF9"
            },
            {
                id:'50+',
                label:'50+',
                value:ageGroups['50+'],
                color:"#90CAF9"
            },
          ])
    }
    useEffect(()=>{
        axiosAuthInstacne
            .get(`admin/user/list`, {
                params:userSearch
            })
            .then((res)=>{
                setUserInfo(res.data);
                setGenderPieData(res.data);
                setAgeRangePieDate(res.data);
            });
    }, [])

    const searchUser = ()=>{
        axiosAuthInstacne
        .get(`admin/user/list`, {
            params:userSearch
        })
        .then((res)=>{
            setUserInfo(res.data);
            setGenderPieData(res.data);
            setAgeRangePieDate(res.data);
        });
    }

    const clickUserId = (userId:string)=>{
        setSelectedUser(userId);
        setModalOpen(true);
    }

    const clickBan = (userId:string)=>{
        setSelectedUser(userId);
        setBanModalOpen(true);
    }

    const setSearchDate = (evt:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>)=>{
        const name  = evt.target.name;
        const value = evt.target.value;
        
        setUserSearch((prevSearch) => ({
            ...prevSearch,
            [name]: value,
        }));
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
               <td className="cursor-pointer text-sky-600 font-bold" onClick={()=>{clickUserId(user.userId)}}>{user.userId}</td>
               <td>{user.nickName}</td>
               <td>{user.email}</td>
               <td>{user.grantType}</td>
               <td>{user.createDate}</td>
               <td className={`bg-[${blockColor}] cursor-pointer text-sky-600 font-bold`} onClick={()=>{clickBan(user.userId)}}>
                {user.blockEnum}</td>
            </tr>
        )
    })
    return (
        <>
        <div className="flex flex-col justify-start items-center w-full min-h-lvh p-5">
            <section className="w-full mb-20">
                <TitleDescription title="유저 목록" desc={"가입한 유저 목록 확인"}/>
                <section className="w-full overflow-x-scroll">
                    <table className={`w-full ${styles.searchTalble}`} >
                        <tbody>
                            <tr>
                                <td className="min-w-[150px]">
                                    <span className="font-bold">유저 아이디</span>
                                </td>
                                <td className="min-w-[150px]">
                                    <input name="userId" onChange={(evt)=>{setSearchDate(evt)}} type="text" value={userSearch?.userId} />
                                </td>
                                <td className="min-w-[150px]">
                                    <span className="font-bold">유저 닉네임</span>
                                </td>
                                <td className="min-w-[150px]">
                                    <input name="nickName" onChange={(evt)=>{setSearchDate(evt)}} type="text" value={userSearch?.nickName} />
                                </td>
                            </tr>
                            <tr>
                                <td className="min-w-[150px]">
                                    <span className="font-bold">유저 이메일</span>
                                </td>
                                <td className="min-w-[150px]">
                                    <input name="email" onChange={(evt)=>{setSearchDate(evt)}} type="text" value={userSearch?.email} />
                                </td>
                                <td className="min-w-[150px]">
                                    <span className="font-bold">회원가입 타입</span>
                                </td>
                                <td className="min-w-[150px]">
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
                        </tbody>
                    </table>
                </section>
                <div className="w-full text-center mt-3 mb-10">
                    <button onClick={()=>searchUser()} className="greenBtn">조회</button>
                </div>
                <section className="w-full overflow-x-scroll">
                    <table className={`w-full text-center ${styles.resultTable}` }>
                        <tbody>
                            <tr className="bg-[#c4dee9] font-bold">
                                <td className="min-w-[150px]">아이디</td>
                                <td className="min-w-[150px]">닉네임</td>
                                <td className="min-w-[150px]">이메일</td>
                                <td className="min-w-[150px]">회원가입 타입</td>
                                <td className="min-w-[150px]">회원가입 일자</td>
                                <td className="min-w-[150px]">상태</td>
                            </tr>
                            {userList}
                        </tbody>
                    </table>
                </section>
            </section>
            <section className="w-full h-[800px] mb-6">
                <div className="w-full h-[300px] mb-10">
                    <h3 className="text-center">성별</h3>
                    <PieChart data={pieGenderChartData} customColors={['#90CAF9', '#FFC0CB']}/>
                </div>
                <div className="w-full h-[300px]">
                    <h3 className="text-center">연령대</h3>
                    <PieChart data={ageRangeData}/>
                </div>
            </section>
        </div>
        <UserDetailModal userId={selectedUser} open={modalOpen} setOpen={setModalOpen} />
        <BanModal userId={selectedUser} open={banModalOpen} setOpen={setBanModalOpen} />
        </>
    )
}