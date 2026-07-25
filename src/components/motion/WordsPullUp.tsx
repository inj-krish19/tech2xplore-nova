"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

/**
 * Splits text into words, each sliding up from a clipped mask on
 * scroll-into-view, staggered. Used for section headlines that want a
 * bit more presence than a static <h2>.
 */
export function WordsPullUp({
    text,
    className,
    wordClassName,
    delayStep = 0.08,
}: {
    text: string;
    className?: string;
    wordClassName?: string;
    delayStep?: number;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const words = text.split(" ");

    return (
        <span ref={ref} className={`inline-flex flex-wrap ${className ?? ""}`}>
            {words.map((word, i) => (
                <span key={`${word}-${i}`} className="overflow-hidden pb-1 pr-[0.25em]">
                    <motion.span
                        className={`inline-block ${wordClassName ?? ""}`}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={inView ? { y: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: i * delayStep, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}