import React from "react";

import { router, useForm, usePage, Link } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { UserCog, Save, ChevronLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@components/ui/separator";

export default function AssignPermissions() {
    const { user, permissions, assignedPermissions } = usePage().props;

    const { data, setData, post, processing } = useForm({
        assignedPermissions: [...assignedPermissions],
    });

    const togglePermission = (permissionId, checked) => {
        const prev = data.assignedPermissions || [];

        const updated = checked
            ? [...prev, permissionId]
            : prev.filter((id) => id !== permissionId);

        setData("assignedPermissions", updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/dashboard/employees/permissions/${user.id}`, {
            onSuccess: () => router.visit("/dashboard/employees"),
        });
    };

    const groupKeywords = {
        "Assets Management": ["asset", "assets"],
        "Employees Management": ["employee", "employees"],
        "Loans Management": ["loan", "loans"],
    };

    const groupedPermissions = {};
    Object.keys(groupKeywords).forEach((group) => {
        groupedPermissions[group] = [];
    });
    groupedPermissions["Other"] = [];

    permissions.forEach((permission) => {
        const lower = permission.name.toLowerCase();
        let matched = false;

        for (const [group, keywords] of Object.entries(groupKeywords)) {
            if (keywords.some((kw) => lower.includes(kw))) {
                groupedPermissions[group].push(permission);
                matched = true;
                break;
            }
        }

        if (!matched) {
            groupedPermissions["Other"].push(permission);
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center px-6 py-2">
                <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                    <UserCog className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                    Assign Permission For {user.name}
                </h1>
                <div>
                    <Link href={`/dashboard/employees/permission/${user.id}`}>
                        <Button className="cursor-pointer">
                            <ChevronLeft />
                            Back
                        </Button>
                    </Link>
                </div>
            </div>
            <Card className="w-full mx-auto">
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-8 px-6">
                        {Object.entries(groupedPermissions).map(
                            ([groupName, perms]) =>
                                perms.length === 0 ? null : (
                                    <div key={groupName} className="space-y-3">
                                        <h3 className="text-md font-semibold text-muted-foreground">
                                            {groupName}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {perms.map((permission) => (
                                                <div
                                                    key={permission.id}
                                                    className="flex items-center gap-3 p-0 border rounded-md shadow-sm hover:bg-muted transition"
                                                >
                                                    <Checkbox
                                                        id={`perm-${permission.id}`}
                                                        className="ml-3 cursor-pointer"
                                                        checked={data.assignedPermissions.includes(
                                                            permission.id
                                                        )}
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            togglePermission(
                                                                permission.id,
                                                                checked
                                                            )
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={`perm-${permission.id}`}
                                                        className="text-sm font-medium w-full h-full m-3 cursor-pointer"
                                                    >
                                                        {permission.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator />
                                    </div>
                                )
                        )}

                        <div className="flex justify-end">
                            <Button
                                className="cursor-pointer"
                                type="submit"
                                disabled={processing}
                            >
                                <Save />
                                {processing ? "Saving..." : "Save Permissions"}
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}

AssignPermissions.layout = (page) => <Dashboard>{page}</Dashboard>;
