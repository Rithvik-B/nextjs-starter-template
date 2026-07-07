import { Code2, Lock, Paintbrush, Zap } from "lucide-react";

const features = [
    {
        icon: Lock,
        title: "Authentication",
        description: "JWT auth with login, register, profile management & token refresh built-in.",
    },
    {
        icon: Zap,
        title: "API Client",
        description: "Type-safe HTTP client with auto token handling, refresh logic & error management.",
    },
    {
        icon: Paintbrush,
        title: "Theming",
        description: "Dark/light/system mode toggle powered by next-themes with shadcn/ui design tokens.",
    },
    {
        icon: Code2,
        title: "shadcn/ui",
        description: "Pre-installed component library with Tailwind CSS v4, ready to extend.",
    },
];

export const Heroes = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
            {features.map((feature) => (
                <div
                    key={feature.title}
                    className="group relative rounded-xl border border-border/60 bg-card/50 p-6 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        <feature.icon className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                    </p>
                </div>
            ))}
        </div>
    );
};