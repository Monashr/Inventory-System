import React from "react";
import { router, useForm, usePage, Link, Head } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import { UserCog, Save, ChevronLeft } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@components/ui/separator";
import { Input } from "@/components/ui/input";

export default function AssignPermissions() {
    const { user, permissions, assignedPermissions } = usePage().props;

    const { data, setData, post, processing } = useForm({
        assignedPermissions: [...assignedPermissions],
        position: user.positions[0]?.name || "",
    });

    const togglePermission = (permissionId, checked) => {
        const updated = checked
            ? [...data.assignedPermissions, permissionId]
            : data.assignedPermissions.filter((id) => id !== permissionId);

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

    const groupedPermissions = Object.fromEntries(
        Object.keys(groupKeywords).map((key) => [key, []])
    );
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
        <>
            <Head title="Assign Permissions" />
            <div className="space-y-4">
                <div className="flex justify-between items-center px-6 py-2">
                    <h1 className="flex items-center font-bold text-lg md:text-2xl">
                        <UserCog className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                        Assign Permission For {user.name}
                    </h1>
                    <Link href={`/dashboard/employees/permission/${user.id}`}>
                        <Button className="cursor-pointer">
                            <ChevronLeft />
                            Back
                        </Button>
                    </Link>
                </div>

                <Card className="w-full mx-auto">
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-8 px-6">
                            <div className="space-y-2">
                                <div className="font-bold">
                                    Employee Position
                                </div>
                                <Input
                                    id="position"
                                    type="text"
                                    value={data.position}
                                    onChange={(e) =>
                                        setData("position", e.target.value)
                                    }
                                    placeholder={
                                        data.position?.name ||
                                        "Enter Employee Position"
                                    }
                                />
                            </div>

                            {Object.entries(groupedPermissions).map(
                                ([groupName, perms]) =>
                                    perms.length > 0 && (
                                        <div
                                            key={groupName}
                                            className="space-y-3"
                                        >
                                            <h3 className="text-md font-semibold text-muted-foreground">
                                                {groupName}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {perms.map((permission) => (
                                                    <div
                                                        key={permission.id}
                                                        className="flex items-center gap-3 p-0 border rounded-md shadow-sm hover:bg-muted transition cursor-pointer"
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
                                                            className="text-sm font-medium w-full m-3 cursor-pointer"
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
                                    type="submit"
                                    disabled={processing}
                                    className="cursor-pointer"
                                >
                                    <Save className="mr-2" />
                                    {processing
                                        ? "Saving..."
                                        : "Save Permissions"}
                                </Button>
                            </div>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </>
    );
}

AssignPermissions.layout = (page) => <Dashboard>{page}</Dashboard>;
