import React from "react";

import { usePage, Head, Link } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import { Plus, PackageOpen } from "lucide-react";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import CustomTableFilterButton from "@components/custom/CustomTableFilterButton";
import useLoansIndex from "../Hooks/useLoansIndex";

function EmployeesIndex() {
    const { permissions } = usePage().props;

    const loanIndexLogic = useLoansIndex();

    return (
        <>
            <Head title="Assets" />
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                                <PackageOpen className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                                Loans
                            </h1>
                            {permissions.includes(
                                "make and manage own loan"
                            ) && (
                                <Link href="/dashboard/loans/add">
                                    <Button className="cursor-pointer h-full w-full">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Loans
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <div className="flex justify-between items-center gap-2 px-6">
                            <CustomTableFilterButton
                                currentFilters={loanIndexLogic.currentFilters}
                                setCurrentFilters={
                                    loanIndexLogic.setCurrentFilters
                                }
                                filterValues={loanIndexLogic.filterValues}
                                applyFilters={loanIndexLogic.applyFilters}
                            />

                            <CustomTableSearch
                                search={loanIndexLogic.search}
                                setSearch={loanIndexLogic.setSearch}
                                onSearch={loanIndexLogic.onSearch}
                                placeholder="Search Loans"
                            />
                        </div>
                        <CustomDataTable
                            columns={loanIndexLogic.columns}
                            data={loanIndexLogic.loans.data}
                            onRowClick={loanIndexLogic.onRowClick}
                            onSort={loanIndexLogic.handleSort}
                            filters={loanIndexLogic.filters}
                            noItem="Loans"
                        />
                    </Card>
                    <CustomPagination
                        data={loanIndexLogic.loans}
                        onPaginationChange={loanIndexLogic.onPaginationChange}
                    />
                </div>
            </div>
        </>
    );
}

EmployeesIndex.layout = (page) => <Dashboard children={page} />;
export default EmployeesIndex;
