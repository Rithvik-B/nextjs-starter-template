'use client';

import { Spinner } from "@/components/spinner";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import { UserButton } from "@/components/auth/user-button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Layers } from "lucide-react";

export default function MainLayout(
    { children }: { children: React.ReactNode }
) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return redirect("/");
    }

    return (
        <div className="h-full flex flex-col">
            {/* Top navigation bar */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center px-6 gap-x-4">
                    <Link href="/" className="flex items-center gap-x-2 font-semibold">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                            <Layers className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                        <span>App Name</span>
                    </Link>
                    <div className="ml-auto flex items-center gap-x-2">
                        <ModeToggle />
                        <UserButton />
                    </div>
                </div>
            </header>
            {/* Page content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}