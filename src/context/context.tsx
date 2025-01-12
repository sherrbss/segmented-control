import * as React from "react";

type Mode = "tabs" | "toggle-group";

type PressState = {
    /* Which item was pointer-down on */
    pressedValue?: string;
    /* Did we surpass long-press threshold? */
    isLongPressed: boolean;
    /* Which item is the indicator "snapped" to during drag */
    dragValue?: string;
};

type SegmentedControlContextValue = {
    value: string; // current selected value
    setValue: React.Dispatch<React.SetStateAction<string>>;
    mode: Mode;
    longPressThreshold: number;
    orientation: "horizontal" | "vertical";
    contentOrientation: "horizontal" | "vertical";

    // Press/drag logic
    pressState: PressState;
    setPressState: React.Dispatch<React.SetStateAction<PressState>>;

    // Register triggers for measurement & snapping
    registerTrigger: (val: string, ref: HTMLElement | null) => void;
    unregisterTrigger: (val: string) => void;
    getTriggerRef: (val: string) => HTMLElement | null;
    triggerRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
};

const SegmentedControlContext = React.createContext<SegmentedControlContextValue | null>(null);

function useSegmentedControlContext() {
    const ctx = React.useContext(SegmentedControlContext);
    if (!ctx) {
        throw new Error("useSegmentedControlContext must be used within SegmentedControlContext.");
    }
    return ctx;
}

export default SegmentedControlContext;
export { useSegmentedControlContext, type Mode, type PressState, type SegmentedControlContextValue };
