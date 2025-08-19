import React from "react";

import { Link } from "@inertiajs/react";

import { Plus } from "lucide-react";

import { Button } from "@components/ui/button";

function AssetTypesIndexActionButton({ permissions }) {
    return (
        <>
            {permissions.includes("manage assets") ? (
                <Link href="/dashboard/assettypes/add">
                    <Button className="cursor-pointer h-full w-full">
                        <Plus className="h-4 w-4" />
                        Add Asset Type
                    </Button>
                </Link>
            ) : null}
        </>
    );
}

export default AssetTypesIndexActionButton;
