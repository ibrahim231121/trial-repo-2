import { useEffect, useRef } from 'react';

const usePrevious = (value: number): number => {
    const ref = useRef<number>(0);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export default usePrevious;
