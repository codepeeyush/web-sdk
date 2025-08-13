'use client'
import { TestimonialsColumn } from "@/components/blocks/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
    {
        text: "We migrated in a day and saw load times drop by 40%. The global CDN and edge caching are incredible.",
        image: "https://avatar.vercel.sh/jack",
        name: "Jack Harper",
        role: "Frontend Engineer",
    },
    {
        text: "Zero-downtime deploys and instant rollbacks let us ship multiple times a day without fear.",
        image: "https://avatar.vercel.sh/sara",
        name: "Sara Kim",
        role: "Product Manager",
    },
    {
        text: "Autoscaling handled our launch traffic spike automatically. No pager duty this time.",
        image: "https://avatar.vercel.sh/michael",
        name: "Michael Chen",
        role: "Tech Lead",
    },
    {
        text: "Support is outstanding—real engineers who helped us tune caching and observability.",
        image: "https://avatar.vercel.sh/liwei",
        name: "Li Wei",
        role: "DevOps Engineer",
    },
    {
        text: "Costs are predictable. Usage insights and spend guardrails saved our team thousands.",
        image: "https://avatar.vercel.sh/amanda",
        name: "Amanda Brooks",
        role: "Engineering Manager",
    },
    {
        text: "Security features like managed TLS, WAF, and per-region controls checked all our compliance boxes.",
        image: "https://avatar.vercel.sh/diego",
        name: "Diego Santos",
        role: "Security Lead",
    },
    {
        text: "Git-to-deploy is seamless. Preview environments for every PR changed our workflow.",
        image: "https://avatar.vercel.sh/fatima",
        name: "Fatima Noor",
        role: "Staff Engineer",
    },
    {
        text: "Edge functions put logic close to users. Latency to APAC dropped dramatically.",
        image: "https://avatar.vercel.sh/oliver",
        name: "Oliver Grant",
        role: "CTO",
    },
    {
        text: "The dashboard is clear and powerful—logs, metrics, and alerts in one place.",
        image: "https://avatar.vercel.sh/jules",
        name: "Jules Martin",
        role: "Platform Lead",
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
