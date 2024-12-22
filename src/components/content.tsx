import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

import { useSegmentedControlContext } from "../context/root-context";
import { useComposedRefs } from "../hooks/use-composed-refs";

type SegmentedControlContentProps = Tabs.TabsContentProps;

/**
 * The panel that is shown only if mode === 'tabs' and this item is selected
 */
const Content = React.forwardRef<HTMLDivElement, SegmentedControlContentProps>(
    ({ value, children, style, ...rest }, forwardedRef) => {
        const { value: selectedValue, mode } = useSegmentedControlContext();
        const localRef = React.useRef<HTMLDivElement | null>(null);
        const composedRef = useComposedRefs(localRef, forwardedRef);

        // If mode is "toggle-group", never render content
        if (mode === "toggle-group") return null;

        // Only render if this matches the selected value
        const isActive = selectedValue === value;
        if (!isActive) return null;

        return (
            <div
                ref={composedRef}
                style={{
                    borderTop: "1px solid #ccc",
                    padding: "1rem",
                    ...style,
                }}
                {...rest}
            >
                {children}
            </div>
        );
    },
);
Content.displayName = "SegmentedControlContent";

export type { SegmentedControlContentProps };
export default Content;
