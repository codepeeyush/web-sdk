'use client'
import { TestimonialsColumn } from "@/components/blocks/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
    {
        text: "We shipped a new dashboard in days. The primitives are accessible and headless, and styling with Tailwind was effortless.",
        image: "https://avatar.vercel.sh/jack",
        name: "Jack Harper",
        role: "Frontend Engineer",
    },
    {
        text: "TypeScript types are rock-solid. Autocomplete and prop docs made the developer experience a joy.",
        image: "https://avatar.vercel.sh/sara",
        name: "Sara Kim",
        role: "Product Designer",
    },
    {
        text: "Design tokens and theming let us adopt our brand instantly. Dark mode was a one-liner.",
        image: "https://avatar.vercel.sh/michael",
        name: "Michael Chen",
        role: "Tech Lead",
    },
    {
        text: "Documentation is excellent—copy-paste examples and clear composition patterns saved us hours.",
        image: "https://avatar.vercel.sh/liwei",
        name: "Li Wei",
        role: "UI Engineer",
    },
    {
        text: "Performance stayed snappy. Tree-shaking kept bundles lean and there's no runtime CSS overhead.",
        image: "https://avatar.vercel.sh/amanda",
        name: "Amanda Brooks",
        role: "Engineering Manager",
    },
    {
        text: "Accessibility is baked in—focus management, ARIA, and keyboard navigation worked out of the box.",
        image: "https://avatar.vercel.sh/diego",
        name: "Diego Santos",
        role: "Accessibility Specialist",
    },
    {
        text: "Composable APIs match our mental model. It feels like building blocks that just snap together.",
        image: "https://avatar.vercel.sh/fatima",
        name: "Fatima Noor",
        role: "Staff Frontend Engineer",
    },
    {
        text: "Consistency across components reduced cognitive load—our juniors were productive on day one.",
        image: "https://avatar.vercel.sh/oliver",
        name: "Oliver Grant",
        role: "CTO",
    },
    {
        text: "Releases are steady and well-documented. Semantic versioning and clear changelogs made upgrades painless.",
        image: "https://avatar.vercel.sh/jules",
        name: "Jules Martin",
        role: "Design Systems Lead",
    },
];


const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);


export default function Testimonials() {
    return (
        <section className="bg-background my-20 relative" id="testimonials">

            <div className="container z-10 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
                >
                    <div className="flex justify-center">
                        <div className="border py-1 px-4 rounded-lg">Testimonials</div>
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
                        What our users say
                    </h2>
                    <p className="text-center mt-5 opacity-75">
                        See what our customers have to say about us.
                    </p>
                </motion.div>

                <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                </div>
            </div>
        </section>
    );
};
