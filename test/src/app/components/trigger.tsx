import { cva } from "class-variance-authority";

const triggerStyles = cva([
    "relative flex-1 flex items-center justify-center text-white whitespace-nowrap h-[32px] tracking-normal",
    "data-[drag=active-pressed]:scale-[0.92] data-[drag=active-pressed]:tracking-[-0.01em]",
    "data-[drag=active-pressed][data-align=right][data-orientation=horizontal]:translate-x-[4px]",
    "data-[drag=active-pressed][data-align=left][data-orientation=horizontal]:translate-x-[-4px]",
    "data-[drag=inactive]:opacity-[0.65]",
    "data-[drag=inactive-pressed]:opacity-[0.5] data-[drag=inactive-pressed]:delay-200",
]);

export { triggerStyles };
