import { PressState } from "../context/root-context";

const getDragValue = ({
    pressState,
    value,
    selectedValue,
}: {
    pressState: PressState;
    value: string;
    selectedValue: string;
}) => {
    const selected = selectedValue === value;
    if (selected && pressState.pressedValue === value && pressState.activeDragValue === value) {
        return "active";
    }
    return "inactive";
};

export const getDragState = ({
    pressState,
    value,
    selectedValue,
}: {
    pressState: PressState;
    value: string;
    selectedValue: string;
}) => {
    // const isSelected = selectedValue === value;
    // const isDragging = pressState.isDragging && !!pressState.activeDragValue;
    // const wasInitiallyPressed = pressState.isLongPressed && pressState.pressedValue === value;
    // const isHighlighted = pressState.isDragging && pressState.activeDragValue === value;

    // 0. selected is true + pressed is false - -> selected styles
    // 1. selected is true + pressed is true + drag is "active" -> scale 0.9, selected styles
    // 2. selected is true + pressed is true + drag is not "active" -> unselected styles
    // 3. selected is false + drag is not "active" -> unselected styles
    // 4. selected is false + pressed is true + drag is "active" -> scale 0.9, unselected styles
    // 5. selected is false + pressed is false + drag is "active" -> selected styles

    // const selected = selectedValue === value;
    // const drag = pressState.isDragging && selected && pressState.pressedValue === value;
    const selected = selectedValue === value;
    return {
        selected: selectedValue === value,
        pressed: pressState.pressedValue === value,
        drag:
            !selected || !pressState.activeDragValue
                ? "none"
                : pressState.activeDragValue === value
                ? "active"
                : "other",
    } as const;

    // active-highlighted -
    // active-unhighlighted -
    // inactive-highlighted -
    // inactive-unhighlighted -

    // if (isDragging) {
    //     /* we are dragging the control */
    //     if (isSelected && wasInitiallyPressed) {
    //         if (isHighlighted) {
    //             return {
    //                 drag: true,
    //             }
    //         }
    //         return ("active-unhighlighted" as const);
    //     }
    //     /* apply default highlighted styles as we initially pressed another item */
    //     if (isSelected) {
    //         return "active-highlighted" as const;
    //     }
    //     if (isHighlighted) {
    //         return "inactive-highlighted" as const;
    //     }
    //     return "inactive-unhighlighted" as const;
    // }
    // return isSelected ? ("active-highlighted" as const) : ("inactive-unhighlighted" as const);
};

export const getIndicatorState = ({ pressState, selectedValue }: { pressState: PressState; selectedValue: string }) => {
    if (pressState.isDragging && pressState.pressedValue === selectedValue) {
        return pressState.activeDragValue;
    }
    return selectedValue;
};
