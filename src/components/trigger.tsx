import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

import { useSegmentedControlContext } from "../context/root-context";
import { useComposedRefs } from "../hooks/use-composed-refs";

type SegmentedControlTriggerProps = Tabs.TabsTriggerProps;

/**
 * The interactive button that changes the selected item
 */
const Trigger = React.forwardRef<React.ElementRef<typeof Tabs.Trigger>, SegmentedControlTriggerProps>(
    (
        { value, onPointerDown: onPointerDownProp, onPointerUp: onPointerUpProp, style, children, ...rest },
        forwardedRef,
    ) => {
        const {
            value: selectedValue,
            pressState,
            setPressState,
            registerTrigger,
            unregisterTrigger,
            setValue,
        } = useSegmentedControlContext();

        const buttonRef = React.useRef<HTMLButtonElement | null>(null);
        const composedRef = useComposedRefs(buttonRef, forwardedRef);

        React.useEffect(() => {
            registerTrigger(value, buttonRef.current);
            return () => unregisterTrigger(value);
        }, [value, registerTrigger, unregisterTrigger]);

        const selected = value === selectedValue;

        const onPointerDown = React.useCallback(
            (e: React.PointerEvent<HTMLButtonElement>) => {
                e.preventDefault(); /* tab changes are handles internally */
                e.currentTarget.setPointerCapture(e.pointerId);

                setPressState(() => ({
                    pressedValue: value,
                    isLongPressed: true,
                    dragValue: value,
                }));

                onPointerDownProp?.(e);
            },
            [onPointerDownProp, setPressState, value],
        );

        const onPointerUp = React.useCallback(
            (e: React.PointerEvent<HTMLButtonElement>) => {
                console.log("Trigger > onPointerUp", { value, pressState });
                if (buttonRef.current) {
                    const rect = buttonRef.current.getBoundingClientRect();
                    const withinBounds =
                        e.clientX >= rect.left &&
                        e.clientX <= rect.right &&
                        e.clientY >= rect.top &&
                        e.clientY <= rect.bottom;

                    if (withinBounds) {
                        e.stopPropagation();
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setValue(value);
                        setPressState({
                            pressedValue: undefined,
                            isLongPressed: false,
                            dragValue: undefined,
                        });
                    }
                }

                onPointerUpProp?.(e);
            },
            [onPointerUpProp, setValue, setPressState, value],
        );

        const getDataDragAttribute = () => {
            const pressed = pressState.pressedValue === value;
            const dragging = pressState.dragValue === value;

            if (selected) {
                if (pressState.dragValue === undefined) return "active";
                if (pressState.pressedValue !== value) return "active";
                if (!dragging) return "inactive";
                return pressed ? "active-pressed" : "inactive";
            }

            if (dragging && !pressed && pressState.pressedValue === selectedValue) return "active-pressed";
            if (dragging) return "inactive-pressed";
            return "inactive";
        };

        return (
            <Tabs.Trigger
                ref={composedRef}
                value={value}
                type="button"
                data-drag={getDataDragAttribute()}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                style={{
                    flex: 1,
                    cursor: "pointer",
                    height: "100%",
                    transition: "transform 0.2s ease, opacity 0.2s ease",
                    willChange: "transform, opacity",
                    zIndex: 2,
                    ...style,
                }}
                {...rest}
            >
                {children}
            </Tabs.Trigger>
        );
    },
);
Trigger.displayName = "SegmentedControlTrigger";

export type { SegmentedControlTriggerProps };
export default Trigger;
