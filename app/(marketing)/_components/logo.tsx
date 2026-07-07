import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { Layers } from "lucide-react";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"]
});

export const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
                <Layers className="h-4 w-4 text-primary-foreground" />
            </div>
            <p className={cn("font-semibold", font.className)}>
                App Name
            </p>
        </div>
    );
};