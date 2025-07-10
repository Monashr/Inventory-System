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

export default function Login({ errors }) {
    const { data, setData, post, processing, error, reset } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login", {
            onError: () => {},
        });
    };

    return (
        <>
            <Head title="Login" />
            <div className="max-w-md mx-auto mt-24">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
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
                                            "Login"
                                        )}
                                    </Button>
                                    <Button variant="link">
                                        <Link
                                            className="w-full h-full m-0 p-0"
                                            href="/register"
                                        >
                                            Register
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
