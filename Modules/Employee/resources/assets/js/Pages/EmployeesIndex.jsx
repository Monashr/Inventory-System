import React from "react";

import { usePage, Head, Link } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import { Package, User, Mail, Plus } from "lucide-react";
import { Card } from "@components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@components/ui/button";
import CustomTableFilterButton from "@components/custom/CustomTableFilterButton";
import useEmployeesIndex from "../Hooks/useEmployeesIndex";
import AddEmployeeForm from "./EmployeesAdd";

function EmployeesIndex() {
    const { permissions } = usePage().props;

    const employeeIndexLogic = useEmployeesIndex();

    return (
        <>
            <Head title="Assets" />
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                                <User className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                                Employees
                            </h1>
                            <div className="grid grid-cols-1 gap-2 sm:flex">
                                {permissions.includes("invite employees") && (
                                    <Dialog open={employeeIndexLogic.open} onOpenChange={employeeIndexLogic.setOpen}>
                                        <DialogTrigger
                                            className="cursor-pointer"
                                            asChild
                                        >
                                            <Button variant="outline">
                                                <Mail className="h-4 w-4" />
                                                Invite New Employee
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Invite New Employee
                                                </DialogTitle>
                                            </DialogHeader>
                                            <AddEmployeeForm
                                                onClose={() => setOpen(false)}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                )}

                                {permissions.includes("make employees") && (
                                    <Link href="/dashboard/employees/create">
                                        <Button className="cursor-pointer">
                                            <Plus className="h-4 w-4" />
                                            Create New Employee
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex justify-end items-center gap-2 px-6">
                            {/* <CustomTableFilterButton
                                currentFilters={employeeIndexLogic.currentFilters}
                                setCurrentFilters={
                                    employeeIndexLogic.setCurrentFilters
                                }
                                filterValues={employeeIndexLogic.filterValues}
                                applyFilters={employeeIndexLogic.applyFilters}
                            /> */}

                            <CustomTableSearch
                                search={employeeIndexLogic.search}
                                setSearch={employeeIndexLogic.setSearch}
                                onSearch={employeeIndexLogic.onSearch}
                                placeholder="Search Employee"
                            />
                        </div>
                        <CustomDataTable
                            columns={employeeIndexLogic.columns}
                            data={employeeIndexLogic.employees.data}
                            onRowClick={employeeIndexLogic.onRowClick}
                            onSort={employeeIndexLogic.handleSort}
                            filters={employeeIndexLogic.filters}
                            noItem="Employees"
                        />
                    </Card>
                    <CustomPagination
                        data={employeeIndexLogic.employees}
                        onPaginationChange={employeeIndexLogic.onPaginationChange}
                    />
                </div>
            </div>
        </>
    );
}

EmployeesIndex.layout = (page) => <Dashboard children={page} />;
export default EmployeesIndex;
