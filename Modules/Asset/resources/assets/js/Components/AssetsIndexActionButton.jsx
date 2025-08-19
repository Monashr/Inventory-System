import React from "react";

import { Link } from "@inertiajs/react";

import { Plus, FileDown, FileUp } from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@components/ui/button";

function AssetsIndexActionButton({
    permissions,
    fileInputRef,
    handleFileChange,
}) {
    return (
        <>
            {permissions.includes("manage assets") ? (
                <>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="cursor-pointer h-full"
                            >
                                <FileDown />
                                Import Assets
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2 flex flex-col gap-2">
                            <a
                                href="/dashboard/assets/template"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer justify-start"
                                >
                                    <FileDown />
                                    Download Template
                                </Button>
                            </a>

                            <Button
                                variant="outline"
                                className="cursor-pointer w-full justify-start"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <FileDown className="w-3.5 h-3.5" />
                                Import File
                            </Button>
                            <input
                                type="file"
                                accept=".xlsx,.csv"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </PopoverContent>
                    </Popover>

                    <a
                        href="/dashboard/assets/export"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-background inline-flex items-center justify-center border border-input rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition"
                    >
                        <FileUp className="mr-2 w-4 h-4" />
                        Export Assets
                    </a>

                    <Link href="/dashboard/assets/add">
                        <Button className="cursor-pointer w-full h-full">
                            <Plus className="w-4 h-4" />
                            Add Asset
                        </Button>
                    </Link>
                </>
            ) : null}
        </>
    );
}

export default AssetsIndexActionButton;
