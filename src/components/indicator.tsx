import React from "react";
import { useComposedRefs } from "../hooks/use-composed-refs";
import { useSegmentedControlContext } from "../context/root-context";
import { getIndicatorState } from "../util/helpers";

type SegmentedControlIndicatorProps = React.HTMLAttributes<HTMLSpanElement> & {
    indicatorColor?: string;
    transitionDuration?: number;
    placement?: "top" | "bottom" | "inset" | "custom";
};

const getStyles = ({
    placement,
    indicatorColor,
    coords,
}: {
    placement?: "top" | "bottom" | "inset" | "custom";
    indicatorColor: string;
    coords: {
        x: number;
        width: number;
    };
}): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
        transform: `translate3d(${coords.x}px, 0, 0)`,
        willChange: "transform",
        width: coords.width,
    };
    if (placement === "custom") return {};
    if (placement === "top" || placement === "bottom") {
        return {
            ...baseStyles,
            position: "absolute",
            [placement]: 0,
            height: 2,
            backgroundColor: indicatorColor,
        };
    }
    if (placement === "inset") {
        return {};
    }
    return baseStyles;
};

/**
 * The underline/pill. We'll do a FLIP-like animation.
 * - We track the "last highlight" in `prevHighlightRef`.
 * - On each highlightValue change, we measure old and new bounding boxes, invert, then animate.
 * - If the user is dragging from the selected item, we animate each time highlightValue changes.
 * - If user long presses an unselected item, the highlightValue won't change until pointer up => no animation mid-drag.

 */
const Indicator = React.forwardRef<HTMLSpanElement, SegmentedControlIndicatorProps>(
    ({ indicatorColor = "#007AFF", transitionDuration = 400, placement, style: styleProp, ...rest }, forwardedRef) => {
        const { value: selectedValue, pressState, getTriggerRef } = useSegmentedControlContext();
        const indicatorRef = React.useRef<HTMLSpanElement | null>(null);
        const composedRef = useComposedRefs(indicatorRef, forwardedRef);

        // Track the "highlight" item -> either the user is dragging from the selected item,
        // or it's just the actual selected item
        // const highlightValue =
        //     pressState.isDragging && pressState.activeDragValue ? pressState.activeDragValue : selectedValue;
        const highlightValue = getIndicatorState({ pressState, selectedValue });
        // const highlightValue = selectedValue;

        // Keep a ref to the *previous* highlight so we can animate from old => new
        const prevHighlightRef = React.useRef<string | null>(null);

        // For final layout
        const [coords, setCoords] = React.useState({ x: 0, width: 0 });

        // Helper: measure bounding box for a trigger
        const measureBox = React.useCallback(
            (val: string) => {
                const btn = getTriggerRef(val);
                if (!btn) return null;
                const rect = btn.getBoundingClientRect();
                const parentRect = btn.offsetParent?.getBoundingClientRect();
                if (!parentRect) return null;
                return {
                    x: rect.left - parentRect.left,
                    width: rect.width,
                };
            },
            [getTriggerRef],
        );

        React.useEffect(() => {
            if (!highlightValue) return;

            // measure new bounding box
            const newBox = measureBox(highlightValue);
            if (!newBox) return;

            const el = indicatorRef.current;
            if (!el) return;

            // If we have no old highlight, just place ourselves (no animation).
            if (!prevHighlightRef.current) {
                setCoords({ x: newBox.x, width: newBox.width });
                prevHighlightRef.current = highlightValue;
                return;
            }

            // If the highlight is unchanged, do nothing
            if (prevHighlightRef.current === highlightValue) return;

            // We do FLIP from the "old highlight" bounding box to the "new highlight" bounding box
            const oldBox = measureBox(prevHighlightRef.current);
            if (!oldBox) {
                // If old box can't be measured, fallback to immediate
                setCoords({ x: newBox.x, width: newBox.width });
                prevHighlightRef.current = highlightValue;
                return;
            }

            // Step 1: Immediately set final coords
            setCoords({ x: newBox.x, width: newBox.width });
            el.getBoundingClientRect(); // force reflow

            // Step 2: Invert transform from old to new
            const dx = oldBox.x - newBox.x;
            const scaleX = oldBox.width / newBox.width;

            // Temporarily disable transitions, jump to old bounding box
            el.style.transition = "none";
            el.style.transform = `translate3d(${dx}px, 0, 0) scaleX(${scaleX})`;
            el.getBoundingClientRect(); // force reflow

            // Step 3: Animate to transform: none
            requestAnimationFrame(() => {
                el.style.transition = `transform ${transitionDuration}ms ease`;
                el.style.transform = "translate3d(0, 0, 0) scaleX(1)";
            });

            // Update previous highlight
            prevHighlightRef.current = highlightValue;
        }, [highlightValue, measureBox, transitionDuration]);

        return (
            <span
                ref={composedRef}
                style={{
                    ...getStyles({ placement, indicatorColor, coords }),
                    ...styleProp,
                }}
                {...rest}
            />
        );
    },
);
Indicator.displayName = "SegmentedControlIndicator";

export type { SegmentedControlIndicatorProps };
export default Indicator;
