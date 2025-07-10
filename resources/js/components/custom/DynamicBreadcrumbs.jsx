import React from "react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePage } from "@inertiajs/react";

export default function DynamicBreadcrumbs() {
    const page = usePage();
    const rawSegments = page.url.split("/").filter(Boolean);

    const segments = rawSegments.filter((segment) => isNaN(Number(segment)));

    const buildHref = (index) =>
        "/" +
        rawSegments
            .slice(0, rawSegments.indexOf(segments[index]) + 1)
            .join("/");

    return (
        <Breadcrumb className="mb-4">
            <BreadcrumbList>
                {segments.map((segment, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink
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
