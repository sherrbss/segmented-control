import * as React from "react";

type Mode = "tabs" | "toggle-group";

type PressState = {
    /* Which item was pointer-down on */
    pressedValue: string | null;
    /* Did we surpass long-press threshold? */
    isLongPressed: boolean;
    /* Are we currently dragging? */
    isDragging: boolean;
    /* Which item is the indicator "snapped" to during drag */
    activeDragValue: string | null;
};

type SegmentedControlContextValue = {
    value: string; // current selected value
    setValue: React.Dispatch<React.SetStateAction<string>>;
    pressed?: string; // currently pressed value
    setPressed: React.Dispatch<React.SetStateAction<string | undefined>>;
    drag?: string; // currently dragged value
    setDrag: React.Dispatch<React.SetStateAction<string | undefined>>;
    mode: Mode;
    longPressThreshold: number;

    // Press/drag logic
    pressState: PressState;
    setPressState: React.Dispatch<React.SetStateAction<PressState>>;

    // Register triggers for measurement & snapping
    registerTrigger: (val: string, ref: HTMLButtonElement | null) => void;
    unregisterTrigger: (val: string) => void;
    getTriggerRef: (val: string) => HTMLButtonElement | null;
};

const SegmentedControlContext = React.createContext<SegmentedControlContextValue | null>(null);

function useSegmentedControlContext() {
    const ctx = React.useContext(SegmentedControlContext);
    if (!ctx) {
        throw new Error("SegmentedControl components must be used inside Root.");
    }
    return ctx;
}

export default SegmentedControlContext;
export { useSegmentedControlContext, type Mode, type PressState, type SegmentedControlContextValue };
