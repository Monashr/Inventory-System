import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Dashboard from "@components/layout/Dashboard";
import { usePage } from "@inertiajs/react";

function LoansDetail() {
    const { loan } = usePage().props;

    console.log(loan);

    return (
        <div className="space-y-8 p-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">Loan Detail</h1>
                <p className="text-muted-foreground">
                    View the information for this loan.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <Label>Name</Label>
                    <div className="border rounded-md p-2">{loan.name}</div>
                </div>
                <div>
                    <Label>Description</Label>
                    <div className="border rounded-md p-2">
                        {loan.description}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Loaned Units</h2>

                {loan.unit.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        No units recorded for this loan.
                    </p>
                )}

                <div className="space-y-6">
                    {loan.unit.map((entry, index) => (
                        <Card key={entry.id}>
                            <CardHeader>
                                <CardTitle>Unit #{index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Item</Label>
                                        <div className="border rounded-md p-2">
                                            {entry.item?.name || "N/A"}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Unit</Label>
                                        <div className="border rounded-md p-2">
                                            {entry.unit_code || "N/A"}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Due Date</Label>
                                        <div className="border rounded-md p-2">
                                            {entry.pivot.due_date || "N/A"}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Return Date</Label>
                                        <div className="border rounded-md p-2">
                                            {entry.due_date || "N/A"}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

LoansDetail.layout = (page) => <Dashboard>{page}</Dashboard>;

export default LoansDetail;
