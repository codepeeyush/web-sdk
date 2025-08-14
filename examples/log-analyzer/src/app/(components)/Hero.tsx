"use client";

// this is a client component
import { useEffect } from "react";
import Link from "next/link";
import { renderCanvas } from "@/components/ui/canvas"
import { DIcons } from "dicons";

import { Button } from "@/components/ui/button";

export default function Hero() {
    useEffect(() => {
        renderCanvas();
    }, []);

    return (
        <section id="home" className="min-h-screen flex flex-col justify-center items-center">
            <div className="animation-delay-8 animate-fadeIn flex flex-col items-center justify-center px-4 text-center">
                <div className="z-10 sm:justify-center md:mb-4">
                    <div className="relative flex items-center whitespace-nowrap rounded-full border bg-popover px-3 py-1 text-xs leading-6  text-primary/60  hover:bg-popover/80">
                        <DIcons.Shapes className="h-5 p-1" /> Introducing AstroHost.
                        <a
                            href="#services"
                            rel="noreferrer"
                            className="hover:text-ali ml-1 flex items-center font-semibold"
                        >
                            <div className="absolute inset-0 flex" aria-hidden="true" />
                            Explore{" "}
                            <span aria-hidden="true">
                                <DIcons.ArrowRight className="h-4 w-4" />
                            </span>
                        </a>
                    </div>
                </div>

                <div className="mb-10 mt-4  md:mt-6">
                    <div className="px-2">
                        <div className="border-ali relative mx-auto h-full max-w-7xl border p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-20">
                            <h1 className="flex  select-none flex-col  px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-8xl">
                                <DIcons.Plus
                                    strokeWidth={4}
                                    className="text-ali absolute -left-5 -top-5 h-10 w-10"
                                />
                                <DIcons.Plus
                                    strokeWidth={4}
                                    className="text-ali absolute -bottom-5 -left-5 h-10 w-10"
                                />
                                <DIcons.Plus
                                    strokeWidth={4}
                                    className="text-ali absolute -right-5 -top-5 h-10 w-10"
                                />
                                <DIcons.Plus
                                    strokeWidth={4}
                                    className="text-ali absolute -bottom-5 -right-5 h-10 w-10"
                                />
                                Your complete platform for blazing-fast hosting.
                            </h1>
                            <div className="flex items-center justify-center gap-1 mt-10">

                                <p className="md:text-md mx-auto mb-16 mt-2 max-w-2xl px-6 text-sm text-primary/60 sm:px-6 md:max-w-4xl md:px-20 lg:text-lg">
                                    AstroHost is a modern hosting platform for web apps and APIs. Deploy in seconds, scale globally, and ship confidently with built-in CDN, autoscaling, observability, and zero-downtime rollouts.
                                </p>
                            </div>

                            <div className="flex justify-center gap-2">
                                <Link href={"/dashboard"}>
                                    <Button variant="default" size="lg" className="cursor-pointer">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                                <Link href={"#services"}>
                                    <Button variant="outline" size="lg" className="cursor-pointer">
                                        Explore Services
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <canvas
                className="bg-skin-base pointer-events-none absolute inset-0 mx-auto"
                id="canvas"
            ></canvas>
        </section>
    );
};


