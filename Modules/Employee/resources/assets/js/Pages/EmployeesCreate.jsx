import React from "react";

import { Head, Link, useForm } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { Loader2, ChevronLeft, UserRound, User } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";

function EmployeesCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard/employees/create", {
            onError: () => {},
        });
    };

    return (
        <>
            <Head title="Create Employee" />
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                                <User className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                                Create Employee
                            </h1>

                            <Link href="/dashboard/employees">
                                <Button
                                    data-modal-trigger="inbox"
                                    className="cursor-pointer"
                                >
                                    <ChevronLeft />
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </Card>
                    <Card>
                        <form onSubmit={handleSubmit} className="p-6 md:p-8">
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-2 w-full">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Enter employee name"
                                    />
                                    {errors.name && (
                                        <span className="text-sm text-red-500">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="employee@email.com"
                                    />
                                    {errors.email && (
                                        <span className="text-sm text-red-500">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Enter Password"
                                    />
                                    {errors.password && (
                                        <span className="text-sm text-red-500">
                                            {errors.password}
                                        </span>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full mt-4 cursor-pointer hover:bg-[#0a639e]"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" />
                                            Please wait
                                        </>
                                    ) : (
                                        "Create Employee"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}

EmployeesCreate.layout = (page) => <Dashboard>{page}</Dashboard>;

export default EmployeesCreate;
