import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";
import { ContactForm } from "@/components/marketing/ContactForm";

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal>
                <p className="font-mono-kicker text-muted-foreground">Get a Quote</p>
                <h1 className="mt-2">
                    <WordsPullUp
                        text="Tell us what you're building"
                        className="font-display text-3xl font-semibold sm:text-4xl"
                    />
                </h1>
                <p className="mt-4 text-muted-foreground">
                    The more specific you can be, the faster we can give you a real answer instead of a vague one.
                </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
                <ContactForm />
            </Reveal>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Prefer email?{" "}
                <a href="mailto:techtoxplore@gmail.com" className="text-accent hover:underline">
                    techtoxplore@gmail.com
                </a>
            </p>
        </div>
    );
}