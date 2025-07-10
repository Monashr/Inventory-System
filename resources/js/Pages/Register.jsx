import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register({ errors }) {
    const { data, setData, post, processing, error, reset } = useForm({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register", {
            onError: () => {},
        });
    };

    return (
        <>
            <Head title="Register" />
            <div className="max-w-md mx-auto mt-24">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Create a new account</CardTitle>
                        <CardDescription>
                            Fill the form below to register
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col items-center gap-6">
                                {error && (
                                    <div className="text-red-600 text-sm bg-red-100 p-2 rounded">
                                        {error}
                                    </div>
                                )}

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
                                        placeholder="Your name"
                                    />
                                    {errors.name && (
                                        <span className="text-sm text-red-500">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                <div className="grid gap-2 w-full">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="you@example.com"
                                    />
                                    {errors.email && (
                                        <span className="text-sm text-red-500">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>

                                <div className="grid gap-2 w-full">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Enter password"
                                    />
                                    {errors.password && (
                                        <span className="text-sm text-red-500">
                                            {errors.password}
                                        </span>
                                    )}
                                </div>

                                <div className="w-full flex flex-col items-center">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full mt-4"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" />
                                                Please wait
                                            </>
                                        ) : (
                                            "Register"
                                        )}
                                    </Button>

                                    <Button variant="link">
                                        <Link
                                            className="w-full h-full m-0 p-0"
                                            href="/login"
                                        >
                                            Already have an account?
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}