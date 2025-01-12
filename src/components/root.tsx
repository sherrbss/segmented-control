"use client";

import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

import SegmentedControlContext, { type Mode, type PressState } from "../context/context";
import { useControllableState } from "../hooks/use-controllable-state";
import "../styles.css";

type SegmentedControlRootProps = Tabs.TabsProps & {
    mode?: Mode;
    longPressThreshold?: number;
    pressed?: string;
    setPressed?: React.Dispatch<React.SetStateAction<string | undefined>>;
    drag?: string;
    setDrag?: React.Dispatch<React.SetStateAction<string | undefined>>;
    contentOrientation?: "horizontal" | "vertical";
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
            orientation = "horizontal",
            contentOrientation = "vertical",
            children,
            ...rest
        },
        ref,
    ) => {
        const [value = "", setValue] = useControllableState<string>({
            prop: valueProp,
            defaultProp: valueProp,
            onChange: onValueChangeProp,
        });

        const [pressState, setPressState] = React.useState<PressState>({
            pressedValue: undefined,
            isLongPressed: false,
            dragValue: undefined,
        });

        const triggerRefs = React.useRef<Record<string, HTMLElement | null>>({});

        const registerTrigger = React.useCallback((val: string, ref: HTMLElement | null) => {
            triggerRefs.current[val] = ref;
        }, []);

        const unregisterTrigger = React.useCallback((val: string) => {
            delete triggerRefs.current[val];
        }, []);

        const getTriggerRef = React.useCallback((val: string) => {
            return triggerRefs.current[val] || null;
        }, []);

        const contextValue = React.useMemo(
            () => ({
                value,
                setValue: setValue as React.Dispatch<React.SetStateAction<string>>,
                mode,
                longPressThreshold,
                pressState,
                setPressState,
                registerTrigger,
                unregisterTrigger,
                getTriggerRef,
                triggerRefs,
                orientation,
                contentOrientation,
            }),
            [
                value,
                setValue,
                mode,
                longPressThreshold,
                pressState,
                setPressState,
                registerTrigger,
                unregisterTrigger,
                getTriggerRef,
                triggerRefs,
                orientation,
                contentOrientation,
            ],
        );

        return (
            <SegmentedControlContext.Provider value={contextValue}>
                <Tabs.Root
                    ref={ref}
                    value={value}
                    onValueChange={setValue}
                    data-segmented-control
                    data-content-orientation={contentOrientation}
                    {...rest}
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
