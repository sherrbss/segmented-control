import { cva } from "class-variance-authority";

const triggerStyles = cva([
    "relative flex-1 flex items-center justify-center text-white whitespace-nowrap h-[32px]",
    "data-[drag=active-pressed]:scale-[0.95]",
    "data-[drag=inactive]:opacity-[0.65]",
    "data-[drag=inactive-pressed]:opacity-[0.5]",
]);

export { triggerStyles };
