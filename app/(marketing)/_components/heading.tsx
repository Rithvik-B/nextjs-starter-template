"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/spinner";
import { SignInButton } from "@/components/auth/sign-in-button";
import Link from "next/link";

export const Heading = () => {
    const { isAuthenticated, isLoading } = useAuth();

    return (
        <div className="max-w-3xl space-y-4">
            <div className="flex items-center justify-center gap-x-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Next.js Starter Template</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Build your next project{" "}
                <span className="underline decoration-primary/50">faster</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium text-muted-foreground">
                Auth, API client, theming &amp; UI components —<br />
                all pre-configured and ready to go.
            </h3>
            {isLoading && (
                <div className="w-full flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
            )}
            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button>
                        Get started
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </SignInButton>
            )}
            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href="/dashboard">
                        Go to Dashboard
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            )}
        </div>
    );
};