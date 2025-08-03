import React from "react";

import { Link, useForm } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { Loader2, ChevronLeft, UserRound } from "lucide-react";

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
        <div>
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-6 py-2">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <UserRound className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Create new employee account
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
                    <Card>
                        <form onSubmit={handleSubmit} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
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
        </div>
    );
}

EmployeesCreate.layout = (page) => <Dashboard>{page}</Dashboard>;

export default EmployeesCreate;
