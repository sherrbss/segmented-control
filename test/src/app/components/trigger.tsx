import { cva } from "class-variance-authority";

export const baseStyles = cva("relative p-4 transition-all duration-200 flex-1 flex items-center justify-center");

/**
 * 1) data-selected=true AND (data-pressed=false OR data-drag != "other")
 *    - text-white (and/or any other “selected” look)
 */
export const scenarioOneStyles = cva([
    "[data-selected=true][data-pressed=false]:text-white",
    "[data-selected=true][data-drag=none]:text-white",
    "[data-selected=true][data-drag=active]:text-white",
]);

/**
 * 2) data-selected=true AND data-pressed=true AND data-drag="other"
 *    - text-[#666]
 */
export const scenarioTwoStyles = cva(["[data-selected=true][data-pressed=true][data-drag=other]:text-[#666]"]);

/**
 * 3) data-selected=false AND data-pressed=true AND data-drag != "active"
 *    - text-[#666], opacity-[0.8], scale-[0.9]
 */
export const scenarioThreeStyles = cva([
    "[data-selected=false][data-pressed=true][data-drag=none]:text-[#666]",
    "[data-selected=false][data-pressed=true][data-drag=none]:opacity-[0.8]",
    "[data-selected=false][data-pressed=true][data-drag=none]:scale-[0.9]",
    "[data-selected=false][data-pressed=true][data-drag=other]:text-[#666]",
    "[data-selected=false][data-pressed=true][data-drag=other]:opacity-[0.8]",
    "[data-selected=false][data-pressed=true][data-drag=other]:scale-[0.9]",
]);

/**
 * 4) data-selected=false AND data-pressed=false AND data-drag="active"
 *    - text-white, scale-[0.9]
 */
export const scenarioFourStyles = cva([
    "[data-selected=false][data-pressed=false][data-drag=active]:text-white",
    "[data-selected=false][data-pressed=false][data-drag=active]:scale-[0.9]",
]);

/**
 * 5) data-selected=false AND data-pressed=false AND data-drag != "active"
 *    - text-[#666]
 */
export const scenarioFiveStyles = cva([
    "[data-selected=false][data-pressed=false][data-drag=other]:text-[#666]",
    "[data-selected=false][data-pressed=false][data-drag=none]:text-[#666]",
]);

/**
 * A single cva() function that applies the base styles and
 * compound variants for the scenarios in the specified order.
 */
export const triggerStyles = cva("relative p-4 transition-all duration-200 flex-1 flex items-center justify-center", {
    variants: {
        selected: {
            true: "data-[selected=true]",
            false: "data-[selected=false]",
        },
        pressed: {
            true: "data-[pressed=true]",
            false: "data-[pressed=false]",
        },
        drag: {
            active: "data-[drag=active]",
            other: "data-[drag=other]",
            none: "data-[drag=none]",
        },
    },
    compoundVariants: [
        /**
         * 1) data-selected=true AND (data-pressed=false OR data-drag != "other")
         *    - text-white
         */
        {
            selected: true,
            pressed: false,
            className: "text-white",
        },
        {
            selected: true,
            drag: "none",
            className: "text-white",
        },
        {
            selected: true,
            drag: "active",
            className: "text-white",
        },

        /**
         * 2) data-selected=true AND data-pressed=true AND data-drag="other"
         *    - text-[#666]
         */
        {
            selected: true,
            pressed: true,
            drag: "other",
            className: "text-[#666]",
        },

        /**
         * 3) data-selected=false AND data-pressed=true AND data-drag != "active"
         *    - text-[#666], opacity-[0.8], scale-[0.9]
         */
        {
            selected: false,
            pressed: true,
            drag: "none",
            className: "text-[#666] opacity-[0.8] scale-[0.9]",
        },
        {
            selected: false,
            pressed: true,
            drag: "other",
            className: "text-[#666] opacity-[0.8] scale-[0.9]",
        },

        /**
         * 4) data-selected=false AND data-pressed=false AND data-drag="active"
         *    - text-white, scale-[0.9]
         */
        {
            selected: false,
            pressed: false,
            drag: "active",
            className: "text-white scale-[0.9]",
        },

        /**
         * 5) data-selected=false AND data-pressed=false AND data-drag != "active"
         *    - text-[#666]
         */
        {
            selected: false,
            pressed: false,
            drag: "other",
            className: "text-[#666]",
        },
        {
            selected: false,
            pressed: false,
            drag: "none",
            className: "text-[#666]",
        },
    ],
});
