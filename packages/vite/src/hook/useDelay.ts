import { useRef } from 'react';

const useDelay = (cb: (...value: any[]) => any, timeout: number) => {
  const ref = useRef(null);

  return (...value: any[]) => {
    clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      cb(...value);
      clearTimeout(ref.current);
    }, timeout);
  }
}
export default useDelay;
