"use client";

import * as React from "react";
import { SegmentedControl } from "toguru";
import { triggerStyles } from "./components/trigger";

export default function Page() {
    const [selected, setSelected] = React.useState("first");
    const [pressed, setPressed] = React.useState<string | undefined>(undefined);
    const [drag, setDrag] = React.useState<string | undefined>(undefined);

    return (
        <div className="w-scareen h-screen bg-white p-8 flex flex-col justify-center gap-6 items-center">
            <div style={{ padding: "2rem" }}>
                <h2>iOS-like Segmented Control</h2>
                <SegmentedControl.Root
                    value={selected}
                    onValueChange={setSelected}
                    pressed={pressed}
                    setPressed={setPressed}
                    drag={drag}
                    setDrag={setDrag}
                    mode="tabs"
                    style={{ border: "1px solid #ccc", borderRadius: 8, overflow: "hidden" }}
                    className="w-[300px] h-[42px]"
                >
                    <SegmentedControl.ControlGroup style={{ backgroundColor: "#333" }}>
                        <SegmentedControl.Trigger value="alpha" className={triggerStyles()}>
                            Alpha
                        </SegmentedControl.Trigger>
                        <SegmentedControl.Trigger value="beta" className={triggerStyles()}>
                            Beta
                        </SegmentedControl.Trigger>
                        <SegmentedControl.Trigger value="gamma" className={triggerStyles()}>
                            Gamma
                        </SegmentedControl.Trigger>
                        <SegmentedControl.Indicator
                            // indicatorColor="#007AFF"
                            // transitionDuration={200}
                            placement="bottom"
                            // style={{
                            //     in
                            // }}
                        />
                    </SegmentedControl.ControlGroup>

                    {/* Renders below the triggers */}
                    <SegmentedControl.Content value="alpha">
                        <p>Content for Alpha</p>
                    </SegmentedControl.Content>
                    <SegmentedControl.Content value="beta">
                        <p>Content for Beta</p>
                    </SegmentedControl.Content>
                    <SegmentedControl.Content value="gamma">
                        <p>Content for Gamma</p>
                    </SegmentedControl.Content>
                </SegmentedControl.Root>

                <p>Currently selected: {selected}</p>
                <p>Currently pressed: {pressed}</p>
                <p>Currently dragged: {drag}</p>
            </div>
        </div>
    );
}
