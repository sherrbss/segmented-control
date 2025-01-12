import * as Tabs from "@radix-ui/react-tabs";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import React from "react";

import { useSegmentedControlContext } from "../context/context";
import { useComposedRefs } from "../hooks/use-composed-refs";
import { findNearestValue, isWithinBounds } from "../util/helpers";
import { Mode } from "../types";

type CommonProps = {
    dir?: "ltr" | "rtl";
};

type ToggleGroupProps = Omit<ToggleGroup.ToggleGroupSingleProps, "type" | "defaultValue">;

type TabsListProps = Omit<Tabs.TabsListProps, "defaultValue">;

type ControlGroupProps<M extends Mode> = CommonProps & (M extends "tabs" ? TabsListProps : ToggleGroupProps);

function ControlGroupImpl<T extends Mode = "toggle-group">(
    props: ControlGroupProps<T>,
    ref: React.Ref<HTMLDivElement>,
) {
    const { value, pressState, setPressState, setValue, triggerRefs, orientation, mode } = useSegmentedControlContext();

    const {
        children,
        onPointerUp: onPointerUpProp,
        onPointerMove: onPointerMoveProp,
        onClick: onClickProp,
        ...rest
    } = props as ControlGroupProps<typeof mode>;

    const innerRef = React.useRef<HTMLDivElement | null>(null);
    const composedRef = useComposedRefs<HTMLDivElement>(ref, innerRef);

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

    const Comp = mode === "tabs" ? Tabs.TabsList : ToggleGroup.Root;

    return (
        <Comp
            ref={composedRef}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
            onClick={onClick}
            data-segmented-control-group=""
            data-orientation={orientation}
            {...((mode === "toggle-group" ? { type: "single" } : {}) as Pick<
                ToggleGroup.ToggleGroupSingleProps,
                "type"
            >)}
            {...rest}
        >
            {children}
        </Comp>
    );
}

const ControlGroup = React.forwardRef(ControlGroupImpl) as <M extends Mode = "toggle-group">(
    props: ControlGroupProps<M> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

export default ControlGroup;
export { type ControlGroupProps };
