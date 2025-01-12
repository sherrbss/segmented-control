import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

import { useSegmentedControlContext } from "../context/context";
import { useComposedRefs } from "../hooks/use-composed-refs";
import { isWithinBounds } from "../util/helpers";

type SegmentedControlTriggerProps = Tabs.TabsTriggerProps;

/**
 * The interactive button that changes the selected item
 */
const Trigger = React.forwardRef<React.ElementRef<typeof Tabs.Trigger>, SegmentedControlTriggerProps>(
    ({ value, onPointerDown: onPointerDownProp, onPointerUp: onPointerUpProp, children, ...rest }, ref) => {
        const {
            value: selectedValue,
            pressState,
            setPressState,
            registerTrigger,
            unregisterTrigger,
            setValue,
        } = useSegmentedControlContext();

        const containerRef = React.useRef<HTMLDivElement | null>(null);

        React.useEffect(() => {
            registerTrigger(value, containerRef.current);
            return () => unregisterTrigger(value);
        }, [value, registerTrigger, unregisterTrigger]);

        const selected = value === selectedValue;

        const onPointerDown = React.useCallback(
            (e: React.PointerEvent<HTMLButtonElement>) => {
                /* prevent pointer event from propagating to other elements */
                e.preventDefault();
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
                if (containerRef.current) {
                    if (
                        isWithinBounds({
                            event: e,
                            element: containerRef.current,
                        })
                    ) {
                        e.stopPropagation();
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        setValue(value);
                    }
                    setPressState({
                        pressedValue: undefined,
                        isLongPressed: false,
                        dragValue: undefined,
                    });
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
            <div ref={containerRef} data-segmented-control-trigger-container="">
                <Tabs.Trigger
                    ref={ref}
                    value={value}
                    type="button"
                    data-segmented-control-trigger=""
                    data-drag={getDataDragAttribute()}
                    onPointerDown={onPointerDown}
                    onPointerUp={onPointerUp}
                    {...rest}
                >
                    {children}
                </Tabs.Trigger>
            </div>
        );
    },
);
Trigger.displayName = "SegmentedControlTrigger";

export type { SegmentedControlTriggerProps };
export default Trigger;
