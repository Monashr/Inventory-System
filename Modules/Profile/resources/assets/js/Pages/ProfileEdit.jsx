import React from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import DynamicBreadcrumbs from "@components/custom/DynamicBreadcrumbs";
import Dashboard from "@components/layout/Dashboard";

function ProfileEdit() {
    const { user, errors } = usePage().props;

    const { data, setData, patch, processing } = useForm({
        name: user.name || "",
        email: user.email || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch("/dashboard/profile", {
            preserveScroll: true,
        });
    };

    return (
        <div className="flex justify-center items-center h-full">
            <div className="max-w-2xl w-xl">
                <Card>
                    <CardContent className="space-y-6">
                        <h2 className="text-xl font-bold">Edit Profile</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Link href="/dashboard/profile">
                                    <Button type="button" className="cursor-pointer" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" className="cursor-pointer" disabled={processing}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

ProfileEdit.layout = (page) => <Dashboard children={page} />;

export default ProfileEdit;
