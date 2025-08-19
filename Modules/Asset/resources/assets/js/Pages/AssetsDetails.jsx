import React from "react";

import { Head, usePage } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

import { Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AssetDetailsActionButton from "../Components/AssetDetailsActionButton";
import AssetDetailsTable from "../Components/AssetDetailsTable";
import CustomDataTable from "@components/custom/CustomDataTable";
import useAssetLogs from "../Hooks/useAssetLogs";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableFilterButton from "@components/custom/CustomTableFilterButton";

function AssetDetail() {
    const { permissions } = usePage().props;

    const AssetDetailsLogic = useAssetLogs();

    return (
        <>
            <Head title={AssetDetailsLogic.asset.asset_type?.name} />
            <div className="space-y-4">
                <Card>
                    <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                        <div className="flex items-center gap-4 m-0 p-0 w-full justify-center sm:justify-start ">
                            <h1 className="flex font-bold text-2xl text-primary bg-accent items-center justify-center rounded-2xl w-10 h-10">
                                {AssetDetailsLogic.asset.asset_type?.name?.charAt(
                                    0
                                ) || "A"}
                            </h1>
                            <div>
                                <h1 className="flex items-center h-full m-0 p-0 font-bold text-2xl md:text-2xl">
                                    {AssetDetailsLogic.asset.serial_code}
                                </h1>
                            </div>
                        </div>
                        <div className="">
                            <AssetDetailsActionButton
                                asset={AssetDetailsLogic.asset}
                                permissions={permissions}
                            />
                        </div>
                    </div>
                </Card>
                <Card className="p-6 px-8">
                    <AssetDetailsTable asset={AssetDetailsLogic.asset} />
                </Card>

                {permissions.includes("audit assets") ? (
                    <>
                        <Card>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-6 py-2">
                                        <h1 className="flex items-center font-bold text-lg md:text-2xl m-0 p0">
                                            <Package className="w-8 h-8 md:w-10 md:h-10 mr-2" />
                                            Logs
                                        </h1>
                                        <CustomTableFilterButton
                                            currentFilters={
                                                AssetDetailsLogic.currentFilters
                                            }
                                            setCurrentFilters={
                                                AssetDetailsLogic.setCurrentFilters
                                            }
                                            filterValues={
                                                AssetDetailsLogic.filterValues
                                            }
                                            applyFilters={
                                                AssetDetailsLogic.applyFilters
                                            }
                                        />
                                    </div>

                                    <Card>
                                        <CustomDataTable
                                            columns={AssetDetailsLogic.columns}
                                            data={AssetDetailsLogic.log.data}
                                            onRowClick={null}
                                            onSort={
                                                AssetDetailsLogic.handleSort
                                            }
                                            filters={AssetDetailsLogic.filters}
                                            noItem="Logs"
                                        />
                                    </Card>
                                    <div className="flex items-center justify-between gap-2">
                                        <CustomPagination
                                            data={AssetDetailsLogic.log}
                                            onPaginationChange={
                                                AssetDetailsLogic.onPaginationChange
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : null}
            </div>
        </>
    );
}

AssetDetail.layout = (page) => <Dashboard children={page} />;

export default AssetDetail;
