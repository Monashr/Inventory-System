import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Dashboard from "@components/layout/Dashboard";
import { usePage, Link } from "@inertiajs/react";
import { Button } from "@components/ui/button";
import LoansForm from "./LoansForm";
import { Separator } from "@components/ui/separator";
import { PackageOpen, Ban, SaveAll } from "lucide-react";

function LoansEdit() {
    const { assetTypes, users, loan } = usePage().props;

    return (
        <div>
            <Card className="w-full mx-auto">
                <CardContent className="space-y-4 pb-4">
                    <div className="px-6 py-6 flex justify-between items-center gap-2">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <PackageOpen className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Edit Loans
                        </h1>
                        <Link href="/dashboard/loans">
                            <Button
                                variant="outline"
                                data-modal-trigger="add-product"
                                className="cursor-pointer h-full"
                            >
                                Cancel
                                <Ban />
                            </Button>
                        </Link>
                    </div>
                    <Separator />
                    <LoansForm
                        assetTypes={assetTypes}
                        users={users}
                        loan={loan}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

LoansEdit.layout = (page) => <Dashboard>{page}</Dashboard>;

export default LoansEdit;
