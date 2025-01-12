import * as React from "react";

import { useSegmentedControlContext } from "../context/context";
import { setStyle } from "../util/helpers";
import { useIndicatorState } from "../hooks/use-indicator-state";

type SegmentedControlIndicatorProps = React.HTMLAttributes<HTMLSpanElement> & {
    transitionDuration?: number;
    layoutId?: string;
};

const Indicator = React.forwardRef<HTMLSpanElement, SegmentedControlIndicatorProps>(
    ({ transitionDuration = 400, layoutId, ...rest }, ref) => {
        const containerRef = React.useRef<HTMLSpanElement | null>(null);

        const { getTriggerRef, orientation, contentOrientation, mode } = useSegmentedControlContext();
        const { value, pressed } = useIndicatorState();

        React.useEffect(() => {
            const getStyles = (val: string) => {
                const btn = getTriggerRef(val);
                if (!btn) return null;

                const rect = btn.getBoundingClientRect();
                const parent = containerRef.current?.offsetParent as HTMLElement | null;
                if (!parent) return null;

                const parentRect = parent.getBoundingClientRect();

                return {
                    width: `${rect.width}px`,
                    height: `${rect.height}px`,
                    top: `${rect.top - parentRect.top}px`,
                    transform: `translate3d(${rect.left - parentRect.left}px, 0, 0) scale(${pressed ? 0.9 : 1})`,
                };
            };

            if (!value) return;

            const el = containerRef.current;
            if (!el) return;

            el.getBoundingClientRect();

            const style = getStyles(value);
            if (!style) return;

            window.requestAnimationFrame(() => {
                setStyle({
                    element: el,
                    style,
                });
                el.getBoundingClientRect();
            });
        }, [transitionDuration, value, pressed, orientation, contentOrientation, mode]);

        return (
            <span
                ref={containerRef}
                data-segmented-control-indicator=""
                style={{
                    willChange: "transform, width",
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
