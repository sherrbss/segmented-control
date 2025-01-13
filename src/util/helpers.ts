import { PressState } from "../types";

/**
 * Set the style of an element.
 */
export function setStyle({
    element,
    style,
}: {
    element: HTMLElement | null | undefined;
    style: Partial<CSSStyleDeclaration>;
}) {
    if (!element) return;

    Object.entries(style).forEach(([property, value]) => {
        if (value !== undefined && value !== null) {
            // @ts-ignore - TypeScript doesn't like dynamic property assignment
            element.style[property] = value;
        }
    });
}

/**
 * Check if a pointer event is within the bounds of a button.
 */
export const isWithinBounds = ({
    event,
    element,
}: {
    event: React.PointerEvent<HTMLElement>;
    element: HTMLElement | null;
}) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
    );
};

/**
 * Find the nearest element provided a given x-coordinate.
 */
export const findNearestValue = ({
    event,
    elements,
    orientation = "horizontal",
}: {
    event: React.PointerEvent<HTMLElement>;
    elements: Record<string, HTMLElement | null>;
    orientation?: "horizontal" | "vertical";
}): string | undefined => {
    const entries = Object.entries(elements);
    if (!entries.length) return undefined;

    if (orientation === "vertical") {
        const distances = entries.map(([val, btn]) => {
            if (!btn) return { val, dist: Infinity };
            const rect = btn.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            return { val, dist: Math.abs(centerY - event.clientY) };
        });
        distances.sort((a, b) => a.dist - b.dist);
        return distances[0]?.val ?? undefined;
    }

    const distances = entries.map(([val, btn]) => {
        if (!btn) return { val, dist: Infinity };
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        return { val, dist: Math.abs(centerX - event.clientX) };
    });
    distances.sort((a, b) => a.dist - b.dist);
    return distances[0]?.val ?? undefined;
};

/**
 * Get the alignment of a trigger by its index.
 */
export const getAlignmentByIndex = ({
    index,
    length,
}: {
    index: number;
    length: number;
}): "left" | "center" | "right" => {
    if (length % 2 === 0) {
        if (index < length / 2) return "left";
        else return "right";
    }
    const middle = Math.floor(length / 2);
    if (index < middle) return "left";
    else if (index === middle) return "center";
    else return "right";
};

/**
 * Get the data attributes for a trigger element based on its state.
 */
export const getDataDragAttributes = ({
    value,
    selectedValue,
    pressState,
}: {
    value: string;
    selectedValue: string;
    pressState: PressState;
}) => {
    const selected = value === selectedValue;
    const pressed = pressState.pressedValue === value;
    const otherPressed = pressState.pressedValue !== undefined && pressState.pressedValue !== value;
    const dragging = pressState.dragValue === value;
    const otherDragging = !dragging && pressState.dragValue !== undefined;
    const selectedPressed = pressState.pressedValue === selectedValue;

    if (selected) {
        if (!otherDragging) {
            if (pressed) return { active: true, pressed: true };
            if (!dragging) return { active: true, pressed: false };
        }
        if (otherPressed) return { active: true, pressed: false };
        return { active: false, pressed: false };
    }

    if (dragging && !pressed && selectedPressed) return { active: true, pressed: true };
    if (dragging) return { active: false, pressed: true };
    return { active: false, pressed: false };
};

/**
 * Set the data attributes for an element.
 */
export const setAttributes = ({
    element,
    attributes,
}: {
    element: HTMLElement | null;
    attributes: Record<string, string | boolean>;
}) => {
    if (!element) return;
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(`data-${key}`, `${value}`);
    });
};
