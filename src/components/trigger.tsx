import * as Tabs from "@radix-ui/react-tabs";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import React from "react";

import { useSegmentedControlContext } from "../context/context";
import { getDataDragAttributes, isWithinBounds, setAttributes } from "../util/helpers";
import { useComposedRefs } from "../hooks/use-composed-refs";
import { Mode } from "../types";

type SegmentedControlTriggerProps<T extends Mode> = T extends "tabs"
    ? Tabs.TabsTriggerProps
    : ToggleGroup.ToggleGroupItemProps;

/**
 * The interactive button that changes the selected item
 */
function TriggerImpl<T extends Mode = "toggle-group">(
    props: SegmentedControlTriggerProps<T>,
    ref: React.Ref<HTMLButtonElement>,
) {
    const {
        value: selectedValue,
        pressState,
        setPressState,
        registerTrigger,
        setValue,
        orientation,
        mode,
    } = useSegmentedControlContext();

    const {
        value,
        onPointerDown: onPointerDownProp,
        onPointerUp: onPointerUpProp,
        children,
        ...rest
    } = props as SegmentedControlTriggerProps<typeof mode>;

    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const composedRef = useComposedRefs<HTMLButtonElement>(ref, triggerRef);
    const containerRef = React.useRef<HTMLElement | null>(null);
    const longPressTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const onPointerDown = React.useCallback(
        (e: React.PointerEvent<HTMLButtonElement>) => {
            /* prevent pointer event from propagating to other elements */
            e.preventDefault();
            e.currentTarget.setPointerCapture(e.pointerId);

            if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
            longPressTimeoutRef.current = setTimeout(() => {
                setPressState(() => ({
                    pressedValue: value,
                    isLongPressed: true,
                    dragValue: value,
                }));
            }, 25);

            onPointerDownProp?.(e);
        },
        [onPointerDownProp, setPressState, value],
    );

    const onPointerUp = React.useCallback(
        (e: React.PointerEvent<HTMLButtonElement>) => {
            if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
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

    React.useEffect(() => {
        setAttributes({
            element: triggerRef.current,
            attributes: getDataDragAttributes({
                value,
                selectedValue,
                pressState,
            }),
        });
    }, [pressState, selectedValue, value]);

    React.useEffect(() => {
        return () => {
            if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
        };
    }, []);

    const Comp = mode === "tabs" ? Tabs.Trigger : ToggleGroup.ToggleGroupItem;

    return (
        <div
            ref={(el) => {
                if (el) {
                    const { alignment } = registerTrigger(value, el);
                    containerRef.current = el;
                    triggerRef.current?.setAttribute("data-align", alignment);
                }
                return ref;
            }}
            data-segmented-control-trigger-container=""
        >
            <Comp
                ref={composedRef}
                value={value}
                type="button"
                data-segmented-control-trigger=""
                // data-drag={getDataDragAttribute()}
                data-orientation={orientation}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                {...rest}
            >
                {children}
            </Comp>
        </div>
    );
}

const Trigger = React.forwardRef(TriggerImpl) as <T extends Mode = "toggle-group">(
    props: SegmentedControlTriggerProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

export type { SegmentedControlTriggerProps };
export default Trigger;
