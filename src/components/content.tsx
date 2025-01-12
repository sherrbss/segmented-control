import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

import { useSegmentedControlContext } from "../context/context";

type SegmentedControlContentProps = Tabs.TabsContentProps;

/**
 * The panel that is shown only if mode === 'tabs' and this item is selected
 */
const Content = React.forwardRef<HTMLDivElement, SegmentedControlContentProps>(({ value, children, ...rest }, ref) => {
    const { value: selectedValue, mode } = useSegmentedControlContext();

    // If mode is "toggle-group", never render content
    if (mode === "toggle-group") return null;

    // Only render if this matches the selected value
    const isActive = selectedValue === value;
    if (!isActive) return null;

    return (
        <div ref={ref} {...rest}>
            {children}
        </div>
    );
});
Content.displayName = "SegmentedControlContent";

export type { SegmentedControlContentProps };
export default Content;
