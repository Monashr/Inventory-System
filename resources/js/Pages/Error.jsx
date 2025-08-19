import React from "react";

import { Link } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Error({ status }) {
    const title = {
        503: "503: Service Unavailable",
        500: "500: Server Error",
        404: "404: Page Not Found",
        403: "403: Forbidden",
    }[status];

    const description = {
        503: "Sorry, we are doing some maintenance. Please check back soon.",
        500: "Whoops, something went wrong on our servers.",
        404: "Sorry, the page you are looking for could not be found.",
        403: "Sorry, you are forbidden from accessing this page.",
    }[status];

    return (
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-6xl font-bold text-primary">
                        {status}
                    </CardTitle>
                    <CardDescription className="text-2xl font-semibold text-foreground">
                        {title}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground text-lg">
                        {description}
                    </p>
                    <Link href="/login" passHref>
                        <Button className="w-full cursor-pointer">Go Back</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
