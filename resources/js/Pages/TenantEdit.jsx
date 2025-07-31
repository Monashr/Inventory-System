import React, { useState } from "react";

import { useForm, usePage, Link, router } from "@inertiajs/react";

import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import Dashboard from "@components/layout/Dashboard";
import Draggable from "react-draggable";

function ProfileEdit() {
    const { tenant, errors } = usePage().props;

    const [previewUrl, setPreviewUrl] = useState(
        tenant.picture ? `/storage/${tenant.picture}` : null
    );
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const { data, setData, processing } = useForm({
        name: tenant.name || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        description: tenant.description || "",
        address: tenant.address || "",
        industry: tenant.industry || "",
        website: tenant.website || "",
        bio: tenant.bio || "",
        picture: null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("picture", file);
            setPreviewUrl(URL.createObjectURL(file));
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleDrag = (e, ui) => {
        setPosition({ x: ui.x, y: ui.y });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("website", data.website);
        formData.append("description", data.description);
        formData.append("address", data.address);
        formData.append("industry", data.industry);
        formData.append("bio", data.bio);
        if (data.picture) {
            formData.append("picture", data.picture);
        }
        

        router.post("/dashboard/tenant", formData, {
            preserveScroll: true,
        });
    };

    return (
        <div className="flex justify-center items-center h-full">
            <div className="max-w-2xl w-full">
                <Card>
                    <CardContent className="space-y-6 px-8 py-6">
                        <h2 className="text-xl font-bold">Edit Organization</h2>

                        {previewUrl && (
                            <div className="relative w-[500px] h-[500px] overflow-hidden border rounded mx-auto">
                                <Draggable
                                    bounds="parent"
                                    position={position}
                                    onDrag={handleDrag}
                                >
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="absolute"
                                        style={{
                                            height: "auto",
                                            minWidth: "100%",
                                        }}
                                    />
                                </Draggable>
                                <p className="text-xs text-center mt-1 text-gray-500">
                                    Drag to adjust image position (1:1 frame)
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="picture">Profile Picture</Label>
                                <Input
                                    className="cursor-pointer"
                                    id="picture"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {errors.picture && (
                                    <p className="text-sm text-red-500 mt-1">{errors.picture}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
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
                                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData("phone", e.target.value)}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData("address", e.target.value)}
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input
                                    id="industry"
                                    type="text"
                                    value={data.industry}
                                    onChange={(e) => setData("industry", e.target.value)}
                                />
                                {errors.industry && (
                                    <p className="text-sm text-red-500 mt-1">{errors.industry}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    type="url"
                                    value={data.website}
                                    onChange={(e) => setData("website", e.target.value)}
                                />
                                {errors.website && (
                                    <p className="text-sm text-red-500 mt-1">{errors.website}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    className="border p-2 rounded w-full"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Link href="/dashboard/tenant">
                                    <Button className="cursor-pointer" type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button className="cursor-pointer" type="submit" disabled={processing}>
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
