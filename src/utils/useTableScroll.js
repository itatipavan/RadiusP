import { useEffect, useState } from 'react';

// Computes a dynamic table scroll.y based on viewport height minus an estimated offset
export const useTableScrollY = (offset = 320) => {
  const [y, setY] = useState(() => Math.max(window.innerHeight - offset, 200));

  useEffect(() => {
    const handleResize = () => {
      setY(Math.max(window.innerHeight - offset, 200));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [offset]);

  return y;
};

export default useTableScrollY;
