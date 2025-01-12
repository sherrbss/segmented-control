import * as React from "react";

import { useSegmentedControlContext } from "../context/context";
import { setStyle } from "../util/helpers";
import { useIndicatorState } from "../hooks/use-indicator-state";

type SegmentedControlIndicatorProps = React.HTMLAttributes<HTMLSpanElement> & {
    transitionDuration?: number;
    layoutId?: string;
};

const alignmentMap = {
    left: -1,
    center: 0,
    right: 1,
} as const;

const getStyles = ({
    element,
    containerElement,
    parentElement,
    alignment,
    pressed,
    orientation,
}: {
    element: HTMLElement | null;
    containerElement: HTMLElement | null;
    parentElement: HTMLElement | null;
    alignment: "left" | "center" | "right";
    pressed: boolean;
    orientation: "horizontal" | "vertical";
}) => {
    if (!element || !parentElement || !containerElement) return;
    const rect = element.getBoundingClientRect();
    const parentRect = parentElement.getBoundingClientRect();

    const alignmentFactor = orientation === "vertical" ? 1 : alignmentMap[pressed ? alignment : "center"];
    const offset = pressed ? Math.min(rect.width * 0.05, rect.height * 0.125, 4) : 0;
    const halfOffset = offset / 2;

    const width = rect.width - offset;
    const height = rect.height - offset;

    const xOffset = orientation === "vertical" ? 0 : halfOffset * alignmentFactor;
    const leftOffset = rect.width - width + xOffset;

    if (orientation === "vertical") {
        return {
            width: `${width - offset}px`,
            height: `${height}px`,
            top: `${rect.top - parentRect.top + (pressed ? halfOffset : 0)}px`,
            transform: `translate3d(${rect.left - parentRect.left + leftOffset}px, 0, 0)`,
        };
    }

    return {
        width: `${width - offset}px`,
        height: `${height}px`,
        top: "50%",
        transform: `translate3d(${rect.left - parentRect.left + leftOffset}px, -50%, 0)`,
    };
};

const Indicator = React.forwardRef<HTMLSpanElement, SegmentedControlIndicatorProps>(
    ({ transitionDuration = 400, layoutId, ...rest }, ref) => {
        const containerRef = React.useRef<HTMLSpanElement | null>(null);
        const hasRenderedRef = React.useRef(false);

        const { getTriggerRef, getAlignment, orientation, contentOrientation, mode } = useSegmentedControlContext();
        const { value, pressed } = useIndicatorState();

        React.useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            window.requestAnimationFrame(() => {
                const style = getStyles({
                    element: getTriggerRef(value),
                    containerElement: container,
                    parentElement: container.offsetParent as HTMLElement | null,
                    alignment: getAlignment(value),
                    pressed,
                    orientation,
                });

                if (!style) return;

                if (hasRenderedRef.current) {
                    container.style.transitionDuration = `${transitionDuration}ms`;
                } else {
                    hasRenderedRef.current = true;
                    container.style.transitionDuration = "0ms";
                }

                setStyle({
                    element: container,
                    style,
                });

                container.getBoundingClientRect();
            });
        }, [transitionDuration, value, pressed, orientation, contentOrientation, mode, orientation]);

        return (
            <span
                ref={containerRef}
                data-segmented-control-indicator=""
                style={{
                    willChange: "transform, width, height",
                    position: "absolute",
                }}
            >
                <span
                    style={{
                        position: "relative",
                        display: "flex",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                    }}
                >
                    <span ref={ref} {...rest} />
                </span>
            </span>
        );
    },
);
Indicator.displayName = "SegmentedControlIndicator";

export type { SegmentedControlIndicatorProps };
export default Indicator;
