export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
    let timerId: NodeJS.Timeout | undefined;
    return (...args: Parameters<T>) => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => func(...args), delay);
    };
  };
  