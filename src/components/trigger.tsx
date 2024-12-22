import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

import { PressState, useSegmentedControlContext } from "../context/root-context";
import { useComposedRefs } from "../hooks/use-composed-refs";
import { getDragState } from "../util/helpers";

type SegmentedControlTriggerProps = Tabs.TabsTriggerProps;

/**
 * The interactive button that changes the selected item
 */
const Trigger = React.forwardRef<React.ElementRef<typeof Tabs.Trigger>, SegmentedControlTriggerProps>(
    ({ value, onPointerDown, onClick, style, children, ...rest }, forwardedRef) => {
        const {
            value: selectedValue,
            setDrag,
            setPressed,
            pressState,
            setPressState,
            registerTrigger,
            unregisterTrigger,
            longPressThreshold,
            setValue,
        } = useSegmentedControlContext();

        const buttonRef = React.useRef<HTMLButtonElement | null>(null);
        const composedRef = useComposedRefs(buttonRef, forwardedRef);

        React.useEffect(() => {
            registerTrigger(value, buttonRef.current);
            return () => unregisterTrigger(value);
        }, [value, registerTrigger, unregisterTrigger]);

        const selected = value === selectedValue;

        const handlePointerDown = React.useCallback(
            (e: React.PointerEvent<HTMLButtonElement>) => {
                e.preventDefault(); /* tab changes are handles internally */

                /* reset */
                setDrag(value);
                setPressed(value);
                setPressState({
                    pressedValue: value,
                    isLongPressed: true,
                    isDragging: true,
                    activeDragValue: value,
                });

                onPointerDown?.(e);
            },
            [onPointerDown, setPressState, value, longPressThreshold, selectedValue, setPressed, setDrag],
        );

        // Basic styling, focusing on performance (transform usage)
        const baseStyle: React.CSSProperties = {
            flex: 1,
            cursor: "pointer",
            height: "100%",
            transition: "transform 0.2s ease, opacity 0.2s ease",
            willChange: "transform, opacity",
        };

        return (
            <Tabs.Trigger
                {...rest}
                ref={composedRef}
                value={value}
                type="button"
                data-value={value}
                data-pressed={pressState.pressedValue === value}
                data-selected={selected}
                data-drag={
                    selected && pressState.activeDragValue === value
                        ? "active"
                        : selected && !!pressState.activeDragValue
                        ? "other"
                        : "none"
                }
                onPointerDown={handlePointerDown}
                style={{
                    ...baseStyle,
                    ...style,
                }}
            >
                {children}
            </Tabs.Trigger>
        );
    },
);
Trigger.displayName = "SegmentedControlTrigger";

export type { SegmentedControlTriggerProps };
export default Trigger;
