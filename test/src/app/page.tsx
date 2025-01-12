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
                                        onValueChange={setValue}
                                        mode={mode}
                                        orientation={orientation}
                                        contentOrientation={contentOrientation}
                                        className="w-full h-full overflow-hidden"
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

                                        <SegmentedControl.Content
                                            value="alpha"
                                            className={cn(
                                                orientation === "horizontal" && "flex-1",
                                                mode === "toggle-group" && "hidden",
                                            )}
                                        >
                                            <p>Content for Alpha</p>
                                        </SegmentedControl.Content>
                                        <SegmentedControl.Content
                                            value="beta"
                                            className={cn(
                                                orientation === "horizontal" && "flex-1",
                                                mode === "toggle-group" && "hidden",
                                            )}
                                        >
                                            <p>Content for Beta</p>
                                        </SegmentedControl.Content>
                                        <SegmentedControl.Content
                                            value="gamma"
                                            className={cn(
                                                orientation === "horizontal" && "flex-1",
                                                mode === "toggle-group" && "hidden",
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
                                            onValueChange={(v) => setMode(v as "tabs" | "toggle-group")}
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
                                            onValueChange={(v) => setOrientation(v as "horizontal" | "vertical")}
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
                                                onValueChange={(v) =>
                                                    setContentOrientation(v as "horizontal" | "vertical")
                                                }
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
