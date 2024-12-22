import * as Tabs from "@radix-ui/react-tabs";
import React from "react";

import { useComposedRefs } from "../hooks/use-composed-refs";

type ControlGroupProps = Tabs.TabsListProps;

/**
 * A container that holds all Trigger(s) (and optionally Indicator).
 * Content is rendered below this group in the Root.
 */
const ControlGroup = React.forwardRef<HTMLDivElement, ControlGroupProps>(
    ({ children, style, ...rest }, forwardedRef) => {
        const localRef = React.useRef<HTMLDivElement | null>(null);
        const composedRef = useComposedRefs(localRef, forwardedRef);

        return (
            <Tabs.List
                {...rest}
                ref={composedRef}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    position: "relative",
                    height: "100%",
                    ...style,
                }}
            >
                {children}
            </Tabs.List>
        );
    },
);
ControlGroup.displayName = "SegmentedControlControlGroup";

export default ControlGroup;
export { type ControlGroupProps };
