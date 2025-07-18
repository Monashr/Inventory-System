import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Dashboard from "@components/layout/Dashboard";
import { usePage } from "@inertiajs/react";
import LoansForm from "./LoansForm";
import { Separator } from "@components/ui/separator";

import { PackageOpen } from "lucide-react";

function LoansEdit() {
    const { assetTypes, users, loan } = usePage().props;

    return (
        <div>
            <Card className="w-full mx-auto">
                <CardContent className="space-y-4 pb-4">
                    <div className="px-6 py-6">
                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                            <PackageOpen className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                            Edit Loans
                        </h1>
                    </div>
                    <Separator />
                    <LoansForm assetTypes={assetTypes} users={users} loan={loan} />
                </CardContent>
            </Card>
        </div>
    );
}

LoansEdit.layout = (page) => <Dashboard>{page}</Dashboard>;

export default LoansEdit;
