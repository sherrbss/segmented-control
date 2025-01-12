import "../styles.css";

import * as Tabs from "@radix-ui/react-tabs";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import React from "react";

import SegmentedControlContext from "../context/context";
import { useControllableState } from "../hooks/use-controllable-state";
import { getAlignmentByIndex } from "../util/helpers";
import { Mode, PressState } from "../types";

type CommonProps = {
    longPressThreshold?: number;
    pressed?: string;
    setPressed?: React.Dispatch<React.SetStateAction<string | undefined>>;
    drag?: string;
    setDrag?: React.Dispatch<React.SetStateAction<string | undefined>>;
    contentOrientation?: "horizontal" | "vertical";
    alignmentOffset?: number;

    value: string;
    onValueChange?: (value: string) => void;
};

type ToggleGroupProps = Omit<
    Extract<React.ComponentPropsWithoutRef<typeof ToggleGroup.Root>, { type: "single" }>,
    "type"
>;

type TabsProps = Tabs.TabsProps;

type SegmentedControlRootProps<T extends Mode = "toggle-group"> = (T extends "tabs"
    ? TabsProps & { mode?: T }
    : ToggleGroupProps & { mode?: T }) &
    CommonProps;

/**
 * The Root container managing selection state, press/drag logic, etc.
 */
function RootImpl<T extends Mode = "toggle-group">(
    {
        mode = "toggle-group" as T,
        value: valueProp,
        defaultValue,
        onValueChange: onValueChangeProp,
        pressed: pressedProp,
        setPressed: setPressedProp,
        drag: dragProp,
        setDrag: setDragProp,
        longPressThreshold = 200,
        orientation = "horizontal",
        contentOrientation = "vertical",
        alignmentOffset = 4,
        children,
        ...rest
    }: SegmentedControlRootProps<T>,
    ref: React.Ref<HTMLDivElement>,
) {
    const [value = "", setValue] = useControllableState<string>({
        prop: valueProp,
        defaultProp: defaultValue,
        onChange: onValueChangeProp,
    });

    const [pressState, setPressState] = React.useState<PressState>({
        pressedValue: undefined,
        isLongPressed: false,
        dragValue: undefined,
    });

    const alignmentRefs = React.useRef<Record<string, "left" | "center" | "right">>({});
    const triggerRefs = React.useRef<Record<string, HTMLElement | null>>({});

    const registerTrigger = React.useCallback((val: string, el: HTMLElement | null) => {
        triggerRefs.current[val] = el;
        if (el && el.parentElement) {
            const childrenArray = Array.from(el.parentElement.children);
            const index = childrenArray.indexOf(el);

            const length = childrenArray.filter((child) =>
                child.hasAttribute("data-segmented-control-trigger-container"),
            ).length;

            const alignment = getAlignmentByIndex({ index, length });

            alignmentRefs.current[val] = alignment;

            return {
                index,
                length,
                alignment,
            } as const;
        }
        return { index: 0, length: 0, alignment: "center" } as const;
    }, []);

    const unregisterTrigger = React.useCallback((val: string) => {
        delete triggerRefs.current[val];
    }, []);

    const getTriggerRef = React.useCallback((val: string) => {
        return triggerRefs.current[val] || null;
    }, []);

    const getAlignment = React.useCallback((val: string) => {
        return alignmentRefs.current[val] || "center";
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
            getAlignment,
            triggerRefs,
            alignmentRefs,
            orientation,
            contentOrientation,
            alignmentOffset,
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
            getAlignment,
            triggerRefs,
            alignmentRefs,
            orientation,
            contentOrientation,
            alignmentOffset,
        ],
    );

    const Comp = mode === "tabs" ? Tabs.Root : "span";

    /**
     * Render conditionally based on the provided mode.
     * Typescript will infer the correct Radix props from "mode".
     */
    return (
        <SegmentedControlContext.Provider value={contextValue}>
            <Comp
                ref={ref}
                data-segmented-control
                data-content-orientation={contentOrientation}
                type="single"
                orientation={orientation}
                {...(mode === "tabs" ? { value, onValueChange: setValue } : {})}
                {...rest}
            >
                {children}
            </Comp>
        </SegmentedControlContext.Provider>
    );
}

const Root = React.forwardRef(RootImpl) as <T extends Mode = "toggle-group">(
    props: SegmentedControlRootProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null;

export type { SegmentedControlRootProps };
export default Root;
