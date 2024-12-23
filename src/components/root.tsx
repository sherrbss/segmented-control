import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

import SegmentedControlContext, { type Mode, type PressState } from "../context/root-context";
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
        ref,
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
            pressedValue: undefined,
            isLongPressed: false,
            dragValue: undefined,
        });

        React.useEffect(() => {
            // console.log("Root > pressState", pressState);
            setDrag(pressState.dragValue);
            setPressed(pressState.pressedValue);
        }, [pressState, setDrag, setPressed]);

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
            ],
        );

        // console.log("Root > pressedState", { pressState, pressed, drag });

        return (
            <SegmentedControlContext.Provider value={contextValue}>
                <Tabs.Root
                    ref={ref}
                    value={value}
                    onValueChange={setValue}
                    style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        position: "relative",
                        userSelect: "none",
                        touchAction: "none",
                        ...style,
                    }}
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
