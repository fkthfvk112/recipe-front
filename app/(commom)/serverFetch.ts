"use server"

export default async function serverFetch({url, queryParams, option}:{url:string, queryParams?:object, option?:RequestInit}):Promise<any>{
    const queryString = queryParams ? `?${objectToQueryString(queryParams)}` : '';
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}${queryString}`;


    return fetch(
        `${fullUrl}`, option
      ).then((res) => {
        if (!res.ok) {
          return res.json().then((errorData)=>{
            throw new Error(errorData.message || '알 수 없는 에러가 발생하였습니다.');
          })

        } else {
          return res.json();
        }
      });
}

const objectToQueryString = (queryParam:Object)=>{
    return Object.entries(queryParam)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
}
