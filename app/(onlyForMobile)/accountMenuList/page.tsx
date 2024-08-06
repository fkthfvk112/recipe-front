"use client"

import { siginInState } from '@/app/(recoil)/recoilAtom';
import { deleteAuthToken } from '@/app/(user)/signin/utils/authUtil';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';

const liClassName = "p-2 pt-5 pb-4 border-b-2 flex items-center justify-between hover:bg-[#e1e1e1] cursor-pointer";
export default function MyAccountMenuList(){
    const [isSignIn, setIsSignIn] = useRecoilState(siginInState);
    const router = useRouter();


    const handelLogOut = ()=>{
        deleteAuthToken(); //server sid job
        setIsSignIn(false);
        router.refresh();
    }

    
    const goToMyFeed = async () => {
        router.push(`/userfeed/myfeed`);
    };

    const goToCreatMyDiet = ()=>{
        router.push(`/diet/mydiet/create`);
    }

    const goToSetting = ()=>{
        router.push(`/accountSetting`);
    }


    return(
        <div className="flex justify-start items-center flex-col max-w-[1024px] w-full mt-10 bg-white p-3">
            <h3 className='m-6'>마이</h3>
            <ul className="w-full">
                <li onClick={goToMyFeed} className={liClassName}>
                    <p>내 피드</p>
                    <NavigateNextIcon sx={{height:'30px', width:'30px', fill:'#a1a1a1'}}/>
                </li>
                <li onClick={goToCreatMyDiet} className={`${liClassName}`}>
                    <p>식단 작성</p>
                    <NavigateNextIcon sx={{height:'30px', width:'30px', fill:'#a1a1a1'}}/>
                </li>
                <li onClick={goToSetting} className={`${liClassName}`}>
                    <p>계정 설정</p>
                    <NavigateNextIcon sx={{height:'30px', width:'30px', fill:'#a1a1a1'}}/>
                </li>
                <div className='text-center mt-6'>
                    <button onClick={handelLogOut} className='border-none underline underline-offset-4'>로그아웃</button>
                </div>
            </ul>
        </div>
    )
}