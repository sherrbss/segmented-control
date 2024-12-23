import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

import { useSegmentedControlContext } from "../context/root-context";
import { useComposedRefs } from "../hooks/use-composed-refs";

type ControlGroupProps = Tabs.TabsListProps;

/**
 * A container that holds all Trigger(s) (and optionally Indicator).
 * Content is rendered below this group in the Root.
 */
const ControlGroup = React.forwardRef<HTMLDivElement, ControlGroupProps>(
    (
        {
            onPointerUp: onPointerUpProp,
            onPointerMove: onPointerMoveProp,
            onClick: onClickProp,
            children,
            style,
            ...rest
        },
        ref,
    ) => {
        const innerRef = React.useRef<HTMLDivElement | null>(null);
        const composedRef = useComposedRefs(ref, innerRef);

        const { value, pressState, setPressState, setValue, triggerRefs } = useSegmentedControlContext();

        // Finds the nearest trigger to a pointer X (for snapping during drag)
        const findNearestValue = React.useCallback((clientX: number): string | undefined => {
            const entries = Object.entries(triggerRefs.current);
            if (!entries.length) return undefined;

            const distances = entries.map(([val, btn]) => {
                if (!btn) return { val, dist: Infinity };
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                return { val, dist: Math.abs(centerX - clientX) };
            });
            distances.sort((a, b) => a.dist - b.dist);
            return distances[0]?.val ?? undefined;
        }, []);

        const onPointerMove = React.useCallback(
            (e: React.PointerEvent<HTMLDivElement>) => {
                if (pressState.pressedValue) {
                    const nearestVal = findNearestValue(e.clientX);
                    setPressState((prev) => ({ ...prev, dragValue: nearestVal }));
                }

                onPointerMoveProp?.(e);
            },
            [pressState.pressedValue, findNearestValue, value, setPressState, onPointerMoveProp],
        );

        const onPointerUp = React.useCallback(
            (e: React.PointerEvent<HTMLDivElement>) => {
                console.log("ControlGroup > onPointerUp", { value, pressState });
                if (pressState.dragValue) {
                    setValue(pressState.dragValue);
                    setPressState({
                        pressedValue: undefined,
                        isLongPressed: false,
                        dragValue: undefined,
                    });
                }
            },
            [pressState.dragValue, pressState.dragValue, findNearestValue, value, setPressState],
        );

        const onClick = React.useCallback(
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                console.log("ControlGroup > onClick", { value, pressState });
                if (pressState.dragValue) {
                    setValue(pressState.dragValue);
                    setPressState({
                        pressedValue: undefined,
                        isLongPressed: false,
                        dragValue: undefined,
                    });
                }

                onClickProp?.(e);
            },
            [onClickProp],
        );

        return (
            <Tabs.List
                ref={composedRef}
                onPointerUp={onPointerUp}
                onPointerMove={onPointerMove}
                onClick={onClick}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    position: "relative",
                    height: "100%",
                    ...style,
                }}
                {...rest}
            >
                {children}
            </Tabs.List>
        );
    },
);
ControlGroup.displayName = "SegmentedControlControlGroup";

export default ControlGroup;
export { type ControlGroupProps };
