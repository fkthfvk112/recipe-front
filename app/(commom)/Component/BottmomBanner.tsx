'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { defaultAxios } from '@/app/(customAxios)/authAxios'
import { EventDTO } from '@/app/admin/evt/page'
import { useRouter } from 'next/navigation'

export default function BottomBanner() {
    const router = useRouter();

    const [isMobile, setIsMobile] = useState<boolean>(true);
    const [events, setEvents] = useState<EventDTO[]>([]);
    const [isOpen, setIsOpen] = useState(false)
    const [bannerContainerCss, setBannerContainerCss] = useState<string>("fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-end justify-center");

    useEffect(()=>{
        defaultAxios.get("evt/recent-list").then((res)=>{
            setEvents(res.data);
        });
    }, [])


    useEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        setIsMobile(isMobile);

        if(!isMobile){
            setBannerContainerCss("fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center");
        }else{
            setBannerContainerCss("fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-end justify-center");
        }
        const hiddenUntil = localStorage.getItem('bannerHiddenUntil')
        if (!hiddenUntil) {
        setIsOpen(true)
        return
        }

        const now = new Date()
        const hiddenDate = new Date(hiddenUntil)

        if (now > hiddenDate) {
        setIsOpen(true)
        }
    }, [])

    const handleClose = () => {
        setIsOpen(false)
    }

    const handleCloseUntil = ()=>{
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        localStorage.setItem('bannerHiddenUntil', tomorrow.toISOString())
        setIsOpen(false)
    }

    const goEvtPage = (evtId:number)=>{
        router.push(`/board/evt/detail/${evtId}`)
    }

    if(events.length <= 0){
        return<></>
    }

    const slideItems = events.map((evt, inx)=>{
        return(
            <SwiperSlide key={inx} className='w-full h-full aspect-square rounded-t-2xl'>
                <div onClick={()=>goEvtPage(evt.eventId)} className='cursor-pointer'>
                    <Image
                    className='rounded-t-2xl'
                    src={evt.bannerImgUrl}
                    alt={evt.name}
                    fill
                    style={{objectFit: 'cover'}}
                    />
                </div>
            </SwiperSlide>
        )
    })

    return (
        <AnimatePresence>
        {isOpen && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={bannerContainerCss}
            onClick={handleClose}
            >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`text-white shadow-2xl w-[100%]  max-w-3xl`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 슬라이드 영역 */}
                <Swiper
                spaceBetween={0}
                slidesPerView={1}
                centeredSlides
                className={`w-full aspect-square rounded-t-2xl  ${isMobile?"rounded-t-[3rem]":""}`}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                >
                    {slideItems}
                </Swiper>
                <div className='w-full bg-white flex justify-between items-center relative'>
                    <div
                    onClick={handleCloseUntil}
                    className="text-xs text-left m-2 border-none whitespace-nowrap text-[#a1a1a1] cursor-pointer" 
                    >
                    하루 동안 보지 않기
                    </div>
                    <div 
                    onClick={handleClose}
                    className='text-sm m-2 text-right whitespace-nowrap text-[#3b3b3b] cursor-pointer'
                    >
                        닫기
                    </div>
                </div>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    )
}