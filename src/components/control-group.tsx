import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

import { useSegmentedControlContext } from "../context/context";
import { useComposedRefs } from "../hooks/use-composed-refs";
import { findNearestValue, isWithinBounds } from "../util/helpers";

type ControlGroupProps = Tabs.TabsListProps;

const ControlGroup = React.forwardRef<HTMLDivElement, ControlGroupProps>(
    (
        { onPointerUp: onPointerUpProp, onPointerMove: onPointerMoveProp, onClick: onClickProp, children, ...rest },
        ref,
    ) => {
        const innerRef = React.useRef<HTMLDivElement | null>(null);
        const composedRef = useComposedRefs(ref, innerRef);

        const { value, pressState, setPressState, setValue, triggerRefs, orientation } = useSegmentedControlContext();

        const pointerMoveEventRef = React.useRef<React.PointerEvent<HTMLDivElement> | null>(null);
        const pointerMoveRafRef = React.useRef<number | null>(null);

        React.useEffect(() => {
            return () => {
                if (pointerMoveRafRef.current !== null) {
                    cancelAnimationFrame(pointerMoveRafRef.current);
                }
            };
        }, []);

        const onPointerMove = React.useCallback(
            (e: React.PointerEvent<HTMLDivElement>) => {
                pointerMoveEventRef.current = e;

                if (pointerMoveRafRef.current !== null) {
                    cancelAnimationFrame(pointerMoveRafRef.current);
                }

                pointerMoveRafRef.current = requestAnimationFrame(() => {
                    if (!pointerMoveEventRef.current) return;
                    const event = pointerMoveEventRef.current;

                    if (pressState.pressedValue) {
                        if (pressState.pressedValue !== value) {
                            const el = triggerRefs.current[pressState.pressedValue];
                            if (
                                !isWithinBounds({
                                    event,
                                    element: el,
                                })
                            ) {
                                setPressState((prev) => ({ ...prev, dragValue: undefined }));
                                return;
                            }
                        }

                        const nearestVal = findNearestValue({
                            event,
                            elements: triggerRefs.current,
                            orientation,
                        });
                        if (pressState.dragValue !== nearestVal) {
                            setPressState((prev) => ({ ...prev, dragValue: nearestVal }));
                        }
                    }
                });

                onPointerMoveProp?.(e);
            },
            [pressState, value, setPressState, triggerRefs, orientation, onPointerMoveProp],
        );

        const onPointerUp = React.useCallback(
            (e: React.PointerEvent<HTMLDivElement>) => {
                if (pressState.dragValue) {
                    setValue(pressState.dragValue);
                    setPressState({
                        pressedValue: undefined,
                        isLongPressed: false,
                        dragValue: undefined,
                    });
                }

                onPointerUpProp?.(e);
            },
            [pressState.dragValue, setValue, setPressState, onPointerUpProp],
        );

        const onClick = React.useCallback(
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
            [pressState.dragValue, setValue, setPressState, onClickProp],
        );

        return (
            <Tabs.List
                ref={composedRef}
                onPointerUp={onPointerUp}
                onPointerMove={onPointerMove}
                onClick={onClick}
                data-segmented-control-group=""
                data-orientation={orientation}
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
