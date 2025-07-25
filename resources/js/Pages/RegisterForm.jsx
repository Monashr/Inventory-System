import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Loader2 } from "lucide-react";

export default function RegisterForm({ className, errors, ...props }) {
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
            <div className="flex justify-center items-center m-auto h-screen p-12">
                <div className="flex flex-col gap-6 w-full">
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <form
                                onSubmit={handleSubmit}
                                className="p-6 md:p-8"
                            >
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-2xl font-bold">
                                            Create a new account
                                        </h1>
                                        <p className="text-muted-foreground text-balance">
                                            Fill the form below to register
                                        </p>
                                    </div>
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
                                    <div className="grid gap-3">
                                        {error && (
                                            <div className="text-red-600 text-sm bg-red-100 p-2 rounded">
                                                {error}
                                            </div>
                                        )}
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="your@email.com"
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
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
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
                                            "Login"
                                        )}
                                    </Button>
                                    <div className="text-center text-sm">
                                        Don&apos;t have an account?{" "}
                                        <a
                                            href="/register"
                                            className="underline underline-offset-4"
                                        >
                                            Sign up
                                        </a>
                                    </div>
                                </div>
                            </form>
                            <div className="relative hidden md:flex md:justify-center md:items-center">
                                <img
                                    src="/logo-cbn.png"
                                    alt="Image"
                                    className="absolute h-96 w-96 object-contain object-center mx-auto"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        By clicking continue, you agree to our{" "}
                        <a href="#">Terms of Service</a> and{" "}
                        <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </>
    );
}
