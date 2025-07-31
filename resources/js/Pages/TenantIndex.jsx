import React from "react";

import { usePage, Link } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { Pencil } from "lucide-react";

import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";

function TenantIndex() {
    const { tenant } = usePage().props;

    return (
        <div className="flex justify-center items-center h-full">
            <div className="max-w-2xl w-full space-y-6">
                <Card>
                    <CardContent className="space-y-6 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Organization</h2>
                            <Link href="/dashboard/tenant/edit">
                                <Button
                                    className="cursor-pointer"
                                    variant="outline"
                                    size="sm"
                                >
                                    <Pencil />
                                    Edit Organization
                                </Button>
                            </Link>
                        </div>

                        <div className="flex justify-around items-center">
                            {tenant.pictures ? (
                                <div className="flex justify-center">
                                    <img
                                        src={`/storage/${tenant.pictures}`}
                                        alt="Profile"
                                        className="w-48 h-48 object-cover rounded-full border"
                                    />
                                </div>
                            ) : (
                                <div className="flex justify-center items-center w-48 h-48 rounded-full border text-gray-500 text-sm">
                                    No Image
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Name
                                    </p>
                                    <p className="font-medium">{tenant.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="font-medium">
                                        {tenant.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Phone
                                    </p>
                                    <p className="font-medium">
                                        {tenant.phone || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Website
                                    </p>
                                    <p className="font-medium">
                                        {tenant.website || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Industry
                                    </p>
                                    <p className="font-medium">
                                        {tenant.industry || "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Address
                                </p>
                                <p className="font-medium whitespace-pre-wrap">
                                    {tenant.address || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    description
                                </p>
                                <p className="font-medium whitespace-pre-wrap">
                                    {tenant.description || "-"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

TenantIndex.layout = (page) => <Dashboard children={page} />;

export default TenantIndex;
