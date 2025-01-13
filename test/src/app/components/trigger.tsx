import { cva } from "class-variance-authority";

const triggerStyles = cva([
    "relative flex-1 flex items-center justify-center text-white text-sm whitespace-nowrap h-[32px] tracking-normal",
    "hover:bg-transparent focus:bg-transparent active:bg-transparent",
    "data-[active=true]:opacity-[1]",
    "data-[active=false]:opacity-[0.65]",
    "data-[active=false][data-pressed=true]:opacity-[0.5] data-[active=false][data-pressed=true]:delay-200",
]);

export { triggerStyles };
