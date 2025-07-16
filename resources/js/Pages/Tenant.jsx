import React, { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@components/ui/dialog";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import Dashboard from "@components/layout/Dashboard";

function Tenant() {
    const { tenant } = usePage().props;
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: tenant.name || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put("/dashboard/tenant", {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="max-w-2xl w-full space-y-6">
                <Card className="shadow-md">
                    <CardContent className="space-y-6 py-6 px-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Organization</h2>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Edit Organization
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Organization</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData("name", e.target.value)
                                                }
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* <div className="space-y-1">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData("email", e.target.value)
                                                }
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div> */}

                                        <DialogFooter>
                                            <Button type="submit" disabled={processing} className="w-full">
                                                {processing ? "Saving..." : "Save Changes"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-medium">{tenant.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{tenant.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

Tenant.layout = (page) => <Dashboard>{page}</Dashboard>;

export default Tenant;
