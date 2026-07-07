"use client";

import { useAuth } from "@/hooks/use-auth";
import { Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-6 p-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Layers className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                    Welcome{user?.name ? `, ${user.name}` : ''}!
                </h2>
                <p className="text-muted-foreground max-w-md">
                    This is your dashboard. Start building your application from here.
                </p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" asChild>
                    <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
                        Next.js Docs
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                </Button>
                <Button variant="outline" asChild>
                    <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
                        shadcn/ui
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                </Button>
            </div>
        </div>
    );
};

export default DashboardPage;
