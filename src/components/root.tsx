import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

import SegmentedControlContext, {
    type Mode,
    type PressState,
    type SegmentedControlContextValue,
} from "../context/root-context";
import { useComposedRefs } from "../hooks/use-composed-refs";
import { useControllableState } from "../hooks/use-controllable-state";

type SegmentedControlRootProps = Tabs.TabsProps & {
    mode?: Mode;
    longPressThreshold?: number;
    pressed?: string;
    setPressed?: React.Dispatch<React.SetStateAction<string | undefined>>;
    drag?: string;
    setDrag?: React.Dispatch<React.SetStateAction<string | undefined>>;
};

/**
 * The Root container managing selection state, press/drag logic, etc.
 */
const Root = React.forwardRef<HTMLDivElement, SegmentedControlRootProps>(
    (
        {
            value: valueProp,
            defaultValue,
            onValueChange: onValueChangeProp,
            pressed: pressedProp,
            setPressed: setPressedProp,
            drag: dragProp,
            setDrag: setDragProp,
            mode = "tabs",
            longPressThreshold = 200,
            children,
            style,
            ...rest
        },
        forwardedRef,
    ) => {
        const [value = "", setValue] = useControllableState<string>({
            prop: valueProp,
            defaultProp: valueProp,
            onChange: onValueChangeProp,
        });
        const [pressed = "", setPressed] = useControllableState<string>({
            prop: pressedProp,
            defaultProp: pressedProp,
            onChange: setPressedProp,
        });
        const [drag = "", setDrag] = useControllableState<string>({
            prop: dragProp,
            defaultProp: dragProp,
            onChange: setDragProp,
        });

        // Press/drag state
        const [pressState, setPressState] = React.useState<PressState>({
            pressedValue: null,
            isLongPressed: false,
            isDragging: false,
            activeDragValue: null,
        });

        // Registry of triggers
        const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

        const registerTrigger = React.useCallback((val: string, ref: HTMLButtonElement | null) => {
            triggerRefs.current[val] = ref;
        }, []);

        const unregisterTrigger = React.useCallback((val: string) => {
            delete triggerRefs.current[val];
        }, []);

        const getTriggerRef = React.useCallback((val: string) => {
            return triggerRefs.current[val] || null;
        }, []);

        // Root ref to capture pointer events
        const rootRef = React.useRef<HTMLDivElement | null>(null);
        const composedRef = useComposedRefs(rootRef, forwardedRef);

        // Finds the nearest trigger to a pointer X (for snapping during drag)
        const findNearestValue = React.useCallback((clientX: number): string | null => {
            const entries = Object.entries(triggerRefs.current);
            if (!entries.length) return null;

            const distances = entries.map(([val, btn]) => {
                if (!btn) return { val, dist: Infinity };
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                return { val, dist: Math.abs(centerX - clientX) };
            });
            distances.sort((a, b) => a.dist - b.dist);
            return distances[0]?.val ?? null;
        }, []);

        const handlePointerMove = React.useCallback(
            (evt: React.PointerEvent<HTMLDivElement>) => {
                if (!pressState.isDragging) return;
                const nearestVal = findNearestValue(evt.clientX);
                setDrag(nearestVal ?? undefined);
                if (nearestVal === value) setPressed(nearestVal);
                setPressState((prev) => ({ ...prev, activeDragValue: nearestVal }));
            },
            [pressState.isDragging, findNearestValue, value, setPressed, setPressState, setDrag],
        );

        const handlePointerUp = React.useCallback(
            (evt: React.PointerEvent<HTMLDivElement>) => {
                if (!pressState.activeDragValue) return;
                setValue(pressState.activeDragValue);
                setDrag(undefined);
                setPressed(undefined);
                setPressState({
                    pressedValue: null,
                    isLongPressed: false,
                    isDragging: false,
                    activeDragValue: null,
                });
            },
            [
                pressState.isDragging,
                pressState.activeDragValue,
                findNearestValue,
                value,
                setPressed,
                setPressState,
                setDrag,
            ],
        );

        const contextValue: SegmentedControlContextValue = {
            value,
            setValue: setValue as React.Dispatch<React.SetStateAction<string>>,
            pressed,
            setPressed,
            drag,
            setDrag,
            mode,
            longPressThreshold,
            pressState,
            setPressState,
            registerTrigger,
            unregisterTrigger,
            getTriggerRef,
        };

        return (
            <SegmentedControlContext.Provider value={contextValue}>
                <Tabs.Root
                    {...rest}
                    ref={composedRef}
                    value={value}
                    onValueChange={setValue}
                    // onPointerDown={(e) =>}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    // onPointerLeave={handlePointerUp}
                    // onPointerLeave={handlePointerUp}
                    style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        position: "relative",
                        userSelect: "none",
                        touchAction: "none",
                        ...style,
                    }}
                >
                    {children}
                </Tabs.Root>
            </SegmentedControlContext.Provider>
        );
    },
);
Root.displayName = "SegmentedControlRoot";

export type { SegmentedControlRootProps };
export default Root;
