"use server"

export default async function serverFetch({url, queryParams, option}:{url:string, queryParams?:object, option?:RequestInit}):Promise<any>{
    const queryString = queryParams ? `?${objectToQueryString(queryParams)}` : '';
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}${queryString}`;

    const res = await fetch(`${fullUrl}`, option);
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result?.message || '알 수 없는 오류가 발생했습니다.');
    }
    return res.json();
 }

const objectToQueryString = (queryParam:Object)=>{
    return Object.entries(queryParam)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
}
