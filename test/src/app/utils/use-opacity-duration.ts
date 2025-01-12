import React from "react";

const useOpacityDuration = (height: number) => {
    const previousHeightRef = React.useRef<number>();

    return React.useMemo(() => {
        const currentHeight = height;
        const previousHeight = previousHeightRef.current;

        const MIN_DURATION = 0.15;
        const MAX_DURATION = 0.27;

        if (!previousHeightRef.current) {
            previousHeightRef.current = currentHeight;
            return MIN_DURATION;
        }

        const heightDifference = Math.abs(currentHeight - (previousHeight ?? 0));
        previousHeightRef.current = currentHeight;

        const duration = Math.min(Math.max(heightDifference / 500, MIN_DURATION), MAX_DURATION);

        return duration;
    }, [height]);
};

export { useOpacityDuration };
