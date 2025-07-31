import React from "react";

import { Link, usePage } from "@inertiajs/react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DynamicBreadcrumbs() {
    const page = usePage();
    const pathname = page.url.split("?")[0];
    const rawSegments = pathname.split("/").filter(Boolean);

    const segments = rawSegments.filter((segment) => isNaN(Number(segment)));

    const buildHref = (index) =>
        "/" +
        rawSegments
            .slice(0, rawSegments.indexOf(segments[index]) + 1)
            .join("/");

    return (
        <Breadcrumb>
            <BreadcrumbList className="flex justify-center items-center">
                {segments.map((segment, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link
                                    href={buildHref(index)}
                                    aria-current={
                                        index === segments.length - 1
                                            ? "page"
                                            : undefined
                                    }
                                    className={
                                        index === segments.length - 1
                                            ? "text-muted-foreground pointer-events-none"
                                            : ""
                                    }
                                >
                                    {formatSegment(segment)}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

function formatSegment(segment) {
    return segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
