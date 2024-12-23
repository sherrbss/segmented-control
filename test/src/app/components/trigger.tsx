import { cva } from "class-variance-authority";

const triggerStyles = cva([
    "relative p-4 transition-all duration-200 flex-1 flex items-center justify-center text-white",

    // "data-[indicator=active]:opacity-[1]",
    "data-[drag=active-pressed]:scale-[0.95]",
    "data-[drag=inactive]:opacity-[0.65]",
    "data-[drag=inactive-pressed]:scale-[0.95] data-[drag=inactive-pressed]:opacity-[0.5]",
]);

export { triggerStyles };
