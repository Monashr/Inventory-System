import React from "react";

import { Link } from "@inertiajs/react";

import DeleteAlertDialog from "@components/custom/DeleteAlertDialog";

import { Pen, Trash2Icon, ChevronLeft } from "lucide-react";

import { Button } from "@components/ui/button";

function AssetDetailsActionButton({ asset, permissions }) {
    return (
        <div className="grid grid-cols-1 gap-2 sm:flex sm:justify-end">
            {permissions.includes("manage assets") ? (
                <Link href={`/dashboard/assets/${asset.id}/edit`}>
                    <Button
                        className="cursor-pointer h-full w-full"
                        variant="outline"
                    >
                        <Pen className="w-4 h-4" />
                        Edit
                    </Button>
                </Link>
            ) : null}
            {permissions.includes("manage assets") ? (
                <DeleteAlertDialog
                    url={`/dashboard/assets/${asset.id}/delete`}
                    title={"Are you sure?"}
                    description={
                        "This action cannot be undone. This will permanently delete the asset."
                    }
                >
                    <Button
                        className="cursor-pointer h-full"
                        variant="destructive"
                    >
                        <Trash2Icon className="w-4 h-4" />
                        Delete
                    </Button>
                </DeleteAlertDialog>
            ) : null}
            <Link href={`/dashboard/assets`}>
                <Button className="cursor-pointer h-full w-full">
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </Button>
            </Link>
        </div>
    );
}

export default AssetDetailsActionButton;
