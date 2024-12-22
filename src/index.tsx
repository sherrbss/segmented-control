import { default as Content } from "./components/content";
import { default as ControlGroup } from "./components/control-group";
import { default as Indicator } from "./components/indicator";
import { default as Root } from "./components/root";
import { default as Trigger } from "./components/trigger";

export type { SegmentedControlRootProps } from "./components/root";
export type { ControlGroupProps } from "./components/control-group";
export type { SegmentedControlTriggerProps } from "./components/trigger";
export type { SegmentedControlContentProps } from "./components/content";
export type { SegmentedControlIndicatorProps } from "./components/indicator";

export const SegmentedControl = {
    Root,
    ControlGroup,
    Trigger,
    Content,
    Indicator,
};
