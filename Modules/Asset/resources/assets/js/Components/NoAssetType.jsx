import React from "react";

import { Link } from "@inertiajs/react";

import { Plus } from "lucide-react";

import { Button } from "@components/ui/button";

function NoAssetType({ text = null }) {
    return (
        <div className="space-y-4 flex flex-col justify-center items-center">
            <p className="text-lg font-medium text-foreground">
                You need to add at least one asset type before creating {text}.
            </p>
            <Link href="/dashboard/assettypes/add">
                <Button variant="default" className="mx-auto cursor-pointer">
                    <Plus />
                    Add Asset Type
                </Button>
            </Link>
        </div>
    );
}

export default NoAssetType;
