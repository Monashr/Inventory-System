// components/employees/AddEmployeeForm.jsx
import React from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function AddEmployeeForm({ onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/dashboard/employees/add", {
            onSuccess: () => {
                onClose?.();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <div className="space-y-2">
                <Label htmlFor="email">Employee Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="Enter employee email"
                    className="h-10 text-base"
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                )}
            </div>
            <Button className="w-full cursor-pointer" type="submit" disabled={processing}>
                {processing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                    </>
                ) : (
                    "Add Employee"
                )}
            </Button>
        </form>
    );
}
