import { useEffect } from 'react';
import { throttle } from 'lodash';

export const useWindowScroll = (config:{ handler:()=>void, delay:number }) => {
  useEffect(() => {
    const { handler, delay } = config;

    const withThrottle = throttle(handler, delay);

    window.addEventListener('scroll', withThrottle);

    return () => {
      window.removeEventListener('scroll', withThrottle);
    };
  }, [config]);
};
