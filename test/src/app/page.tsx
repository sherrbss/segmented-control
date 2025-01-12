"use client";

import * as React from "react";
import { SegmentedControl } from "toguru";
import { triggerStyles } from "./components/trigger";
import { cn } from "./utils";

export default function Page() {
    const [value, setValue] = React.useState("alpha");

    const [orientation, setOrientation] = React.useState<"horizontal" | "vertical">("horizontal");
    const [contentOrientation, setContentOrientation] = React.useState<"horizontal" | "vertical">("vertical");
    const [mode, setMode] = React.useState<"tabs" | "toggle-group">("tabs");

    return (
        <div className="w-scareen h-screen bg-white p-8 flex flex-col justify-center gap-6 items-center">
            <div className="w-[300px] flex flex-col gap-6">
                <div key={`${mode}-${orientation}-${contentOrientation}`} className="w-full">
                    <h2>iOS-like Segmented Control</h2>
                    <SegmentedControl.Root
                        value={value}
                        onValueChange={setValue}
                        mode={mode}
                        className="w-full h-full overflow-hidden"
                        orientation={orientation}
                        contentOrientation={contentOrientation}
                    >
                        <SegmentedControl.ControlGroup
                            className={cn(
                                "bg-[#5F6368] h-fit p-1 rounded-[10px]",
                                mode === "tabs" &&
                                    orientation === "vertical" &&
                                    contentOrientation === "horizontal" &&
                                    "w-fit max-w-[100px]",
                            )}
                        >
                            <SegmentedControl.Trigger value="alpha" className={triggerStyles()}>
                                Alpha
                            </SegmentedControl.Trigger>
                            <SegmentedControl.Trigger value="beta" className={triggerStyles()}>
                                Beta
                            </SegmentedControl.Trigger>
                            <SegmentedControl.Trigger value="gamma" className={triggerStyles()}>
                                Gamma
                            </SegmentedControl.Trigger>
                            <SegmentedControl.Indicator className="bg-[#8d8d8d] h-full w-full rounded-[7px]" />
                        </SegmentedControl.ControlGroup>

                        {/* Renders below the triggers */}
                        <SegmentedControl.Content
                            value="alpha"
                            className={cn(orientation === "horizontal" && "flex-1 border-solid border-gray-300")}
                        >
                            <p>Content for Alpha</p>
                        </SegmentedControl.Content>
                        <SegmentedControl.Content value="beta" className={cn(orientation === "horizontal" && "flex-1")}>
                            <p>Content for Beta</p>
                        </SegmentedControl.Content>
                        <SegmentedControl.Content
                            value="gamma"
                            className={cn(orientation === "horizontal" && "flex-1")}
                        >
                            <p>Content for Gamma</p>
                        </SegmentedControl.Content>
                    </SegmentedControl.Root>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex flex-col">
                        <h1>Mode</h1>
                        <SegmentedControl.Root
                            value={mode}
                            onValueChange={(v) => setMode(v as "tabs" | "toggle-group")}
                            mode="toggle-group"
                            className="w-[300px] overflow-hidden"
                        >
                            <SegmentedControl.ControlGroup className="bg-[#5F6368] p-1 rounded-[10px] w-full">
                                <SegmentedControl.Trigger value="tabs" className={triggerStyles()}>
                                    Tabs
                                </SegmentedControl.Trigger>
                                <SegmentedControl.Trigger value="toggle-group" className={triggerStyles()}>
                                    Toggle Group
                                </SegmentedControl.Trigger>
                                <SegmentedControl.Indicator className="bg-[#8d8d8d] h-full w-full rounded-[7px]" />
                            </SegmentedControl.ControlGroup>
                        </SegmentedControl.Root>
                    </div>

                    <div className="w-full flex flex-col">
                        <h1>Tabs Orientation</h1>
                        <SegmentedControl.Root
                            value={orientation}
                            onValueChange={(v) => setOrientation(v as "horizontal" | "vertical")}
                            mode="toggle-group"
                            className="w-[300px] overflow-hidden"
                        >
                            <SegmentedControl.ControlGroup className="bg-[#5F6368] p-1 rounded-[10px] w-full">
                                <SegmentedControl.Trigger value="horizontal" className={triggerStyles()}>
                                    Horizontal
                                </SegmentedControl.Trigger>
                                <SegmentedControl.Trigger value="vertical" className={triggerStyles()}>
                                    Vertical
                                </SegmentedControl.Trigger>
                                <SegmentedControl.Indicator className="bg-[#8d8d8d] h-full w-full rounded-[7px]" />
                            </SegmentedControl.ControlGroup>
                        </SegmentedControl.Root>
                    </div>

                    <div
                        className={cn(
                            "w-full flex flex-col",
                            mode === "toggle-group" && "pointer-events-none opacity-30",
                        )}
                    >
                        <h1>Content Orientation</h1>
                        <SegmentedControl.Root
                            value={contentOrientation}
                            onValueChange={(v) => setContentOrientation(v as "horizontal" | "vertical")}
                            mode="toggle-group"
                            className="w-[300px] overflow-hidden"
                        >
                            <SegmentedControl.ControlGroup className="bg-[#5F6368] p-1 rounded-[10px] w-full">
                                <SegmentedControl.Trigger value="horizontal" className={triggerStyles()}>
                                    Horizontal
                                </SegmentedControl.Trigger>
                                <SegmentedControl.Trigger value="vertical" className={triggerStyles()}>
                                    Vertical
                                </SegmentedControl.Trigger>
                                <SegmentedControl.Indicator className="bg-[#8d8d8d] h-full w-full rounded-[7px]" />
                            </SegmentedControl.ControlGroup>
                        </SegmentedControl.Root>
                    </div>
                </div>
            </div>
        </div>
    );
}
