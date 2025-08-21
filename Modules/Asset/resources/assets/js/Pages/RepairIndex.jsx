import React from "react";

import { Head, Link } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { Button } from "@components/ui/button";

import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import { Hammer, Plus } from "lucide-react";
import { Card } from "@components/ui/card";
import CustomTableFilterButton from "@components/custom/CustomTableFilterButton";
import useRepairIndex from "../Hooks/Repairs/useRepairIndex";

function AssetsIndex() {
    const repairIndexLogic = useRepairIndex();

    console.log(repairIndexLogic.filterValues);

    return (
        <>
            <Head title="Assets" />
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                                <Hammer className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                                Repairs
                            </h1>
                            <div className="grid grid-cols-1 gap-2 sm:flex">
                                <Link href="/dashboard/repairs/add">
                                    <Button className="cursor-pointer h-full w-full">
                                        <Plus />
                                        Add Repair
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex justify-between items-center gap-2 px-6">
                            <CustomTableFilterButton
                                currentFilters={repairIndexLogic.currentFilters}
                                setCurrentFilters={
                                    repairIndexLogic.setCurrentFilters
                                }
                                filterValues={repairIndexLogic.filterValues}
                                applyFilters={repairIndexLogic.applyFilters}
                            />

                            <CustomTableSearch
                                search={repairIndexLogic.search}
                                setSearch={repairIndexLogic.setSearch}
                                onSearch={repairIndexLogic.onSearch}
                                placeholder="Search Asset"
                            />
                        </div>
                        <CustomDataTable
                            columns={repairIndexLogic.columns}
                            data={repairIndexLogic.repairs.data}
                            onRowClick={repairIndexLogic.onRowClick}
                            onSort={repairIndexLogic.handleSort}
                            filters={repairIndexLogic.filters}
                            noItem="Repairs"
                        />
                    </Card>
                    <CustomPagination
                        data={repairIndexLogic.repairs}
                        onPaginationChange={repairIndexLogic.onPaginationChange}
                    />
                </div>
            </div>
        </>
    );
}

AssetsIndex.layout = (page) => <Dashboard children={page} />;
export default AssetsIndex;
