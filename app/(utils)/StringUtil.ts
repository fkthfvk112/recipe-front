/**문자열과 글자수 n을 받아서 문자열이 n 이상이면 n까지 자른 후 "..."을 붙인다. */
export const truncateString = (str: string, n: number): string=>{
    if (str.length <= n) {
      return str;
    }
    return str.slice(0, n) + '...';
  }
  