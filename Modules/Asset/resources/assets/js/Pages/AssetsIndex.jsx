import React from "react";

import { usePage, Head } from "@inertiajs/react";

import useAssetIndex from "../Hooks/Assets/useAssetsIndex";

import Dashboard from "@components/layout/Dashboard";
import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";
import AssetsIndexActionButton from "../Components/Asset/AssetsIndexActionButton";

import { Package } from "lucide-react";
import { Card } from "@components/ui/card";
import CustomTableFilterButton from "@components/custom/CustomTableFilterButton";

function AssetsIndex() {
    const { permissions } = usePage().props;

    const assetIndexLogic = useAssetIndex();

    return (
        <>
            <Head title="Assets" />
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                                <Package className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                                Assets
                            </h1>
                            <div className="grid grid-cols-1 gap-2 sm:flex">
                                <AssetsIndexActionButton
                                    permissions={permissions}
                                    fileInputRef={assetIndexLogic.fileInputRef}
                                    handleFileChange={
                                        assetIndexLogic.handleFileChange
                                    }
                                />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex justify-between items-center gap-2 px-6">
                            <CustomTableFilterButton
                                currentFilters={assetIndexLogic.currentFilters}
                                setCurrentFilters={
                                    assetIndexLogic.setCurrentFilters
                                }
                                filterValues={assetIndexLogic.filterValues}
                                applyFilters={assetIndexLogic.applyFilters}
                            />

                            <CustomTableSearch
                                search={assetIndexLogic.search}
                                setSearch={assetIndexLogic.setSearch}
                                onSearch={assetIndexLogic.onSearch}
                                placeholder="Search Asset"
                            />
                        </div>
                        <CustomDataTable
                            columns={assetIndexLogic.columns}
                            data={assetIndexLogic.assets.data}
                            onRowClick={assetIndexLogic.onRowClick}
                            onSort={assetIndexLogic.handleSort}
                            filters={assetIndexLogic.filters}
                            noItem="Assets"
                        />
                    </Card>
                    <CustomPagination
                        data={assetIndexLogic.assets}
                        onPaginationChange={assetIndexLogic.onPaginationChange}
                    />
                </div>
            </div>
        </>
    );
}

AssetsIndex.layout = (page) => <Dashboard children={page} />;
export default AssetsIndex;
