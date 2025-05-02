import serverFetch from "@/app/(commom)/serverFetch";
import { Event } from "@/app/(type)/event";
import Image from "next/image";
import Link from "next/link";

export default async function EvtDetail({
    params
  }: {
    params:{evtId:number};
  }){

    const evtData:Event = await serverFetch({
        url:`evt/${params.evtId}`,
        option:{
            cache:"no-cache",
            next: {
                tags: [`evtId-${params.evtId}`],
            }
        }
    })

    return (
        <section className="defaultInnerContainer" style={{ paddingLeft: '1rem', marginTop: '2.5rem', paddingRight: '1rem' }}>
        <div className="bottom-line">
            <h1 className="text-2xl">{evtData.name}</h1>
        </div>
        <div className="mb-12 mt-5">
            {
            evtData?.returnUrl.length > 0?
            <Link href={evtData.returnUrl}>
                <Image
                src={evtData.contentImgUrl}
                alt=""
                loading="lazy"
                width={1000}
                height={1000}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                sizes="100vw"
                quality={100}
                />
            </Link>
            :
            <Image
            src={evtData.contentImgUrl}
            alt=""
            loading="lazy"
            width={1000}
            height={1000}
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            sizes="100vw"
            quality={100}
            />         
            }
        </div>
        </section>
    )

}