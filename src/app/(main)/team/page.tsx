import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { Reveal } from "@/components/motion/Reveal";
import { WordsPullUp } from "@/components/motion/WordsPullUp";

/**
 * TEAM DATA — Tech2Xplore is a developer-focused technology platform and
 * consultancy. Update team member details, photos, and links before launch.
 */
const TEAM_MEMBERS = [
    {
        name: "Aarav Mehta",
        role: "Co-founder & Product Engineer",
        bio: "Contributes to product development and helps turn ideas into practical digital experiences, with a focus on building useful products for developers and technology-focused teams.",
        photo: "https://i.pravatar.cc/300?img=52",
        links: {
            github: "",
            linkedin: "",
            website: "",
        },
    },
    {
        name: "Mohit Jariwala",
        role: "Project Manager",
        bio: "Coordinates project planning, requirements, timelines, and communication between teams and clients, helping ensure that projects are organized and delivered according to their objectives.",
        photo: "https://media.licdn.com/dms/image/v2/D4D03AQGBqP2-KvCrlg/profile-displayphoto-scale_100_100/B4DZ8jo7ODGwAc-/0/1783009360866?e=1787184000&v=beta&t=UmGfX6u6GBEi3egflpiJPE___RBZzTpi5ed0410LqC0",
        links: {
            github: "", //"https://github.com/Msjariwala",
            linkedin: "", //"https://www.linkedin.com/in/mohitjariwala/",
            website: "",
        },
    },
    {
        name: "Krishi",
        role: "Human Resources",
        bio: "Handles recruitment, team coordination, employee support, and internal people operations, helping maintain a productive and collaborative working environment.",
        photo: "https://media.licdn.com/dms/image/v2/D4E03AQEnFZ-HfkONTA/profile-displayphoto-crop_800_800/B4EZhFuqQ8HoAI-/0/1753516528054?e=1787184000&v=beta&t=lsp27vcLYSTXlrYUl3Hj9CwZlWm8dInbsbPuGrVV-8M",
        links: {
            github: "",
            linkedin: "", //"https://www.linkedin.com/in/krishi-shah-hr/",
            website: "",
        },
    },
    {
        name: "Krish Shah",
        role: "Full-Stack Developer",
        bio: "Works on the development of application across every domain of work in development, while contributing to the platform's technical direction and software solutions",
        photo: "https://avatars.githubusercontent.com/u/133616289?v=4",
        links: {
            github: "", //"https://github.com/inj-krish19",
            linkedin: "", // "https://linkedin.com/in/inj-krish19",
            website: "", // "https://krish-shah19.vercel.app",
        },
    },
    {
        name: "Riya Patel",
        role: "UI/UX Designer",
        bio: "Works across interface design and frontend development, helping create intuitive, accessible, and consistent experiences throughout the platform.",
        photo: "https://i.pravatar.cc/300?img=49",
        links: {
            github: "",
            linkedin: "",
            website: "",
        },
    },
    {
        name: "Dev Malhotra",
        role: "Backend Engineer",
        bio: "Focuses on backend systems, APIs, databases, and cloud infrastructure that support reliable and scalable applications for Tech2Xplore and our clients.",
        photo: "https://i.pravatar.cc/300?img=8",
        links: {
            github: "",
            linkedin: "",
            website: "",
        },
    },
    {
        name: "Mansi Shah",
        role: "Content & Community Lead",
        bio: "Helps grow the developer community and content ecosystem at Tech2Xplore, focusing on useful technical content, discussions, and resources for people exploring technology.",
        photo: "https://i.pravatar.cc/300?img=42",
        links: {
            github: "",
            linkedin: "",
            website: "",
        },
    },
    {
        name: "Yash Joshi",
        role: "Software Developer",
        bio: "Works on mobile and application development, contributing to software products and technical initiatives across the wider ecosystem.",
        photo: "https://i.pravatar.cc/300?img=56",
        links: {
            github: "",
            linkedin: "",
            website: "",
        },
    },
    {
        name: "Neel Desai",
        role: "Growth & Partnerships Lead",
        bio: "Works on partnerships, outreach, and growth initiatives that connect Tech2Xplore with developers, businesses, creators, and teams looking for technology solutions.",
        photo: "https://i.pravatar.cc/300?img=57",
        links: {
            github: "",
            linkedin: "",
            website: "",
        },
    },
];

export default function TeamPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal>
                <p className="font-mono-kicker text-muted-foreground">Our Story</p>
                <h1 className="mt-2 max-w-2xl">
                    <WordsPullUp
                        text="Meet the people behind Tech2Xplore"
                        className="font-display text-3xl font-semibold sm:text-4xl"
                    />
                </h1>
            </Reveal>

            <Reveal delay={0.1} className="mt-6 max-w-2xl">
                {/*
                  TODO: replace with the real origin story — how the idea
                  actually came about, why Tech2Xplore specifically, what
                  problem it was built to solve. This is placeholder
                  narrative copy grounded only in facts already on file.
                */}
                <p className="text-muted-foreground">
                    Tech2Xplore started as a legacy Spring Boot and Thymeleaf project — a way to learn by building
                    something real. Somewhere between rebuilding it from scratch in Next.js and taking on real client
                    work alongside it, it stopped being a side project and became both: a blogging and community
                    platform for developers, and a consultancy that builds, ships, and promotes software for teams
                    who'd rather focus on their product than their stack.
                </p>
                <p className="mt-4 text-muted-foreground">
                    We're still small, still hands-on with every project, and still figuring plenty out as we go —
                    which is exactly why the platform and the consultancy live under one roof. Everything we build
                    for clients gets battle-tested on our own product first.
                </p>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
                {TEAM_MEMBERS.map((member, i) => (
                    <Reveal key={member.name} delay={0.1 + i * 0.08}>
                        <div className="tilt-card flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-start">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={member.photo}
                                alt={member.name}
                                className="h-20 w-20 shrink-0 rounded-full object-cover"
                            />
                            <div className="min-w-0">
                                <p className="font-display text-lg font-semibold">{member.name}</p>
                                <p className="text-sm text-accent">{member.role}</p>
                                <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>

                                <div className="mt-4 flex items-center gap-3 text-muted-foreground">
                                    {member.links.github && (
                                        <a
                                            href={member.links.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${member.name} on GitHub`}
                                            className="hover:text-foreground"
                                        >
                                            <FaGithub className="h-4 w-4" />
                                        </a>
                                    )}
                                    {member.links.linkedin && (
                                        <a
                                            href={member.links.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${member.name} on LinkedIn`}
                                            className="hover:text-foreground"
                                        >
                                            <FaLinkedin className="h-4 w-4" />
                                        </a>
                                    )}
                                    {member.links.website && (
                                        <a
                                            href={member.links.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${member.name}'s website`}
                                            className="hover:text-foreground"
                                        >
                                            <FaGlobe className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}