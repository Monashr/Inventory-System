import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Dashboard from "@components/layout/Dashboard";
import { usePage } from "@inertiajs/react";
import LoansForm from "./LoansForm";
import { Separator } from "@components/ui/separator";

function LoansAdd() {
    const { loan, items } = usePage().props;

    console.log(loan);

    return (
        <div>
            <Card className="w-full mx-auto">
                <CardContent className="space-y-4 pb-4">
                    <div className="px-6 py-8">
                        <h1 className="text-2xl font-bold">Add Loans</h1>
                        <p className="text-muted-foreground">
                            View the information for this loan.
                        </p>
                    </div>
                    <Separator />
                    <LoansForm items={items} />
                </CardContent>
            </Card>
        </div>
    );
}

LoansAdd.layout = (page) => <Dashboard>{page}</Dashboard>;

export default LoansAdd;
