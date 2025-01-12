import * as React from "react";
import { PressState } from "../types";

type Mode = "tabs" | "toggle-group";

type SegmentedControlContextValue<T extends Mode = "toggle-group"> = {
    mode: T;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    longPressThreshold: number;
    orientation: "horizontal" | "vertical";
    contentOrientation: "horizontal" | "vertical";
    pressState: PressState;
    setPressState: React.Dispatch<React.SetStateAction<PressState>>;
    alignmentOffset: number;
    registerTrigger: (
        val: string,
        ref: HTMLElement | null,
    ) => {
        index: number;
        length: number;
        alignment: "center" | "left" | "right";
    };
    unregisterTrigger: (val: string) => void;
    getTriggerRef: (val: string) => HTMLElement | null;
    getAlignment: (val: string) => "center" | "left" | "right";
    alignmentRefs: React.MutableRefObject<Record<string, "left" | "center" | "right">>;
    triggerRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
};

const SegmentedControlContext = React.createContext<SegmentedControlContextValue<Mode> | null>(null);

function useSegmentedControlContext<M extends Mode>() {
    const ctx = React.useContext(SegmentedControlContext);
    if (!ctx) {
        throw new Error("Must be used inside SegmentedControl Root");
    }
    // We lie a bit to TS, telling it the context is our generic M
    return ctx as SegmentedControlContextValue<M>;
}

export default SegmentedControlContext;
export { useSegmentedControlContext, type Mode, type PressState, type SegmentedControlContextValue };
