"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import useMeasure from "react-use-measure";
import { SegmentedControl } from "toguru";

import { triggerStyles } from "./components/trigger";
import { cn } from "./utils";
import { useOpacityDuration } from "./utils/use-opacity-duration";

export default function Page() {
    const [value, setValue] = React.useState("alpha");

    const [orientation, setOrientation] = React.useState<"horizontal" | "vertical">("horizontal");
    const [contentOrientation, setContentOrientation] = React.useState<"horizontal" | "vertical">("vertical");
    const [mode, setMode] = React.useState<"tabs" | "toggle-group">("toggle-group");

    const [exampleRef, exampleBounds] = useMeasure();
    const [controlsRef, controlsBounds] = useMeasure();

    const exampleDuration = useOpacityDuration(exampleBounds.height);
    const controlsDuration = useOpacityDuration(controlsBounds.height);

    const enableInlineTabsButton = false as boolean;

    return (
        <div className="w-scareen h-screen bg-white p-8 flex flex-col justify-center gap-6 items-center">
            <div className="w-[300px] flex flex-col gap-6">
                <div className="w-full">
                    <h2>iOS-like Segmented Control</h2>

                    <motion.div
                        animate={{
                            height: exampleBounds.height,
                            transition: {
                                duration: 0.27,
                                ease: [0.25, 1, 0.5, 1],
                            },
                        }}
                        className="overflow-hidden"
                    >
                        <div ref={exampleRef}>
                            <AnimatePresence
                                initial={false}
                                mode="popLayout"
                                custom={{ orientation, contentOrientation }}
                            >
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key={`${orientation}-${contentOrientation}`}
                                    transition={{
                                        duration: exampleDuration,
                                        ease: [0.26, 0.08, 0.25, 1],
                                    }}
                                >
                                    <SegmentedControl.Root
                                        value={value}
                                        onValueChange={setValue as (value: string) => void}
                                        mode={mode}
                                        orientation={orientation}
                                        contentOrientation={contentOrientation}
                                        className={cn("w-full h-full overflow-hidden", "gap-2")}
                                    >
                                        <div
                                            className={cn(
                                                "flex flex-1 w-full h-full items-center gap-2",
                                                mode === "tabs" &&
                                                    orientation === "vertical" &&
                                                    contentOrientation === "horizontal" &&
                                                    "w-fit max-w-[100px]",
                                            )}
                                        >
                                            <SegmentedControl.ControlGroup className="bg-[#5F6368] h-fit p-1 rounded-[10px] flex-1">
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

                                            {enableInlineTabsButton && (
                                                <div className="w-[20px] h-[20px] bg-slate-400 rounded-full" />
                                            )}
                                        </div>

                                        <SegmentedControl.Content
                                            value="alpha"
                                            className={cn(
                                                "flex flex-1 w-full items-center justify-center rounded-md border border-gray-300",
                                                mode === "toggle-group" && "hidden",
                                                contentOrientation === "vertical" && "py-8",
                                            )}
                                        >
                                            <p>Content for Alpha</p>
                                        </SegmentedControl.Content>
                                        <SegmentedControl.Content
                                            value="beta"
                                            className={cn(
                                                "flex flex-1 w-full items-center justify-center rounded-md border border-gray-300",
                                                mode === "toggle-group" && "hidden",
                                                contentOrientation === "vertical" && "py-8",
                                            )}
                                        >
                                            <p>Content for Beta</p>
                                        </SegmentedControl.Content>
                                        <SegmentedControl.Content
                                            value="gamma"
                                            className={cn(
                                                "flex flex-1 w-full items-center justify-center rounded-md border border-gray-300",
                                                mode === "toggle-group" && "hidden",
                                                contentOrientation === "vertical" && "py-8",
                                            )}
                                        >
                                            <p>Content for Gamma</p>
                                        </SegmentedControl.Content>
                                    </SegmentedControl.Root>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    animate={{
                        height: controlsBounds.height,
                        transition: {
                            duration: 0.27,
                            ease: [0.25, 1, 0.5, 1],
                        },
                    }}
                    className="overflow-hidden"
                >
                    <div ref={controlsRef} className="w-full flex flex-col gap-2">
                        <AnimatePresence
                            initial={false}
                            mode="popLayout"
                            custom={{
                                mode,
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                // key={mode}
                                transition={{
                                    duration: controlsDuration,
                                    ease: [0.26, 0.08, 0.25, 1],
                                }}
                            >
                                <div className="w-full flex flex-col gap-2">
                                    <div className="w-full flex flex-col">
                                        <h1>Mode</h1>
                                        <SegmentedControl.Root
                                            value={mode}
                                            onValueChange={setMode as (value: string) => void}
                                            mode="toggle-group"
                                            className="w-[300px] overflow-hidden"
                                        >
                                            <SegmentedControl.ControlGroup className="bg-[#5F6368] p-1 rounded-[10px] w-full">
                                                <SegmentedControl.Trigger value="tabs" className={triggerStyles()}>
                                                    Tabs
                                                </SegmentedControl.Trigger>
                                                <SegmentedControl.Trigger
                                                    value="toggle-group"
                                                    className={triggerStyles()}
                                                >
                                                    Toggle Group
                                                </SegmentedControl.Trigger>
                                                <SegmentedControl.Indicator className="bg-[#8d8d8d] h-full w-full rounded-[7px]" />
                                            </SegmentedControl.ControlGroup>
                                        </SegmentedControl.Root>
                                    </div>

                                    <div className="w-full flex flex-col">
                                        <h1>Control Group Orientation</h1>
                                        <SegmentedControl.Root
                                            value={orientation}
                                            onValueChange={setOrientation as (value: string) => void}
                                            mode="toggle-group"
                                            className="w-[300px] overflow-hidden"
                                        >
                                            <SegmentedControl.ControlGroup className="bg-[#5F6368] p-1 rounded-[10px] w-full">
                                                <SegmentedControl.Trigger
                                                    value="horizontal"
                                                    className={triggerStyles()}
                                                >
                                                    Horizontal
                                                </SegmentedControl.Trigger>
                                                <SegmentedControl.Trigger value="vertical" className={triggerStyles()}>
                                                    Vertical
                                                </SegmentedControl.Trigger>
                                                <SegmentedControl.Indicator className="bg-[#8d8d8d] h-full w-full rounded-[7px]" />
                                            </SegmentedControl.ControlGroup>
                                        </SegmentedControl.Root>
                                    </div>

                                    {mode === "tabs" && (
                                        <div className="w-full flex flex-col">
                                            <h1>Content Orientation</h1>
                                            <SegmentedControl.Root
                                                value={contentOrientation}
                                                onValueChange={setContentOrientation as (value: string) => void}
                                                mode="toggle-group"
                                                className="w-[300px] overflow-hidden"
                                            >
                                                <SegmentedControl.ControlGroup className="bg-[#5F6368] p-1 rounded-[10px] w-full">
                                                    <SegmentedControl.Trigger
                                                        value="horizontal"
                                                        className={triggerStyles()}
                                                    >
                                                        Horizontal
                                                    </SegmentedControl.Trigger>
                                                    <SegmentedControl.Trigger
                                                        value="vertical"
                                                        className={triggerStyles()}
                                                    >
                                                        Vertical
                                                    </SegmentedControl.Trigger>
                                                    <SegmentedControl.Indicator className="bg-[#8d8d8d] h-full w-full rounded-[7px]" />
                                                </SegmentedControl.ControlGroup>
                                            </SegmentedControl.Root>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
