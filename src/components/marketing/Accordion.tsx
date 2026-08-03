"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {items.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                    <div key={item.question}>
                        <button
                            type="button"
                            onClick={() => setOpenIndex(isOpen ? null : i)}
                            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                            aria-expanded={isOpen}
                        >
                            <span className="text-sm font-medium">{item.question}</span>
                            <FiChevronDown
                                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        {isOpen && (
                            <p className="px-6 pb-4 text-sm text-muted-foreground">{item.answer}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}