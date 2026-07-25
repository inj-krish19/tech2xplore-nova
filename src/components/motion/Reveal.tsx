"use client";

import { motion } from "motion/react";

/**
 * The one motion device this app leans on for "premium" feel — a
 * single fade+rise on scroll-into-view, reused everywhere instead of
 * a different animation per section. Respects prefers-reduced-motion
 * via the global CSS override in globals.css.
 */
export function Reveal({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}