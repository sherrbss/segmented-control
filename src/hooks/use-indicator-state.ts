import React from "react";
import { useSegmentedControlContext } from "../context/context";
import { PressState } from "../types";

const getValue = ({ selectedValue, pressState }: { selectedValue: string; pressState: PressState }) => {
    if (
        pressState.dragValue === undefined ||
        pressState.pressedValue === undefined ||
        pressState.pressedValue !== selectedValue
    ) {
        return selectedValue;
    }
    return pressState.dragValue;
};

export const useIndicatorState = () => {
    const { value: selectedValue, pressState } = useSegmentedControlContext();

    return React.useMemo(
        () => ({
            value: getValue({ selectedValue, pressState }),
            pressed: pressState.pressedValue === selectedValue,
        }),
        [selectedValue, pressState],
    );
};
