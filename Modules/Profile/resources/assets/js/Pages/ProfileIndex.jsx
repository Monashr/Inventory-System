import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import DynamicBreadcrumbs from "@components/custom/DynamicBreadcrumbs";
import Dashboard from "@components/layout/Dashboard";

function ProfileIndex() {
    const { user } = usePage().props;

    return (
        <div className="flex justify-center items-center h-full">
            <div className="max-w-2xl w-xl space-y-6">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Profile Information</h2>
                            <Link href="/dashboard/profile/edit">
                                <Button className="cursor-pointer" variant="outline" size="sm">Edit Profile</Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-medium">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

ProfileIndex.layout = (page) => <Dashboard children={page} />

export default ProfileIndex;
