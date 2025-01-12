export type Mode = "tabs" | "toggle-group";

export type PressState = {
    pressedValue?: string;
    isLongPressed: boolean;
    dragValue?: string;
};
