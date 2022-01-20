import { useRef, useCallback, useLayoutEffect } from 'react';

export function useCombinedRef<T>(
    ...refs: (
        | React.MutableRefObject<T | null>
        | React.RefCallback<T | null>
        | undefined
    )[]
) {
    const latestRefs = useRef(refs);

    useLayoutEffect(() => {
        latestRefs.current = refs;
    });

    return useCallback(
        (el: T | null) => {
            latestRefs.current.forEach(ref => {
                if (!ref) return;
                if (typeof ref === 'function') {
                    ref(el);
                } else {
                    ref.current = el;
                }
            });
        },
        [latestRefs]
    );
}
