import React from "react";

import { usePage, Head } from "@inertiajs/react";

import useAssetTypeIndex from "../Hooks/AssetTypes/useAssetTypesIndex";

import Dashboard from "@components/layout/Dashboard";
import AssetTypesIndexActionButton from "../Components/AssetType/AssetTypesActionButton";

import CustomDataTable from "@components/custom/CustomDataTable";
import CustomPagination from "@components/custom/CustomPagination";
import CustomTableSearch from "@components/custom/CustomTableSearch";

import { Package } from "lucide-react";
import { Card } from "@components/ui/card";

import CustomTableFilterButton from "@components/custom/CustomTableFilterButton";

function AssetTypesIndex() {
    const { permissions } = usePage().props;

    const assetTypeIndexLogic = useAssetTypeIndex();

    return (
        <>
            <Head title="Assets" />
            <div className="w-full mx-auto">
                <div className="space-y-4">
                    <Card>
                        <div className="grid grid-cols-1 sm:flex sm:justify-between px-6 py-2 gap-4">
                            <h1 className="flex items-center justify-center sm:justify-start font-bold text-2xl md:text-2xl m-0 p-0">
                                <Package className="w-10 h-10 bg-accent text-primary rounded-2xl mr-4 p-2" />
                                Asset Types
                            </h1>
                            <div className="grid grid-cols-1 gap-2 sm:flex">
                                <AssetTypesIndexActionButton
                                    permissions={permissions}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex justify-between items-center gap-2 px-6">
                            <CustomTableFilterButton
                                currentFilters={
                                    assetTypeIndexLogic.currentFilters
                                }
                                setCurrentFilters={
                                    assetTypeIndexLogic.setCurrentFilters
                                }
                                filterValues={assetTypeIndexLogic.filterValues}
                                applyFilters={assetTypeIndexLogic.applyFilters}
                            />

                            <CustomTableSearch
                                search={assetTypeIndexLogic.search}
                                setSearch={assetTypeIndexLogic.setSearch}
                                onSearch={assetTypeIndexLogic.onSearch}
                                placeholder="Search Asset Type"
                            />
                        </div>
                        <CustomDataTable
                            columns={assetTypeIndexLogic.columns}
                            data={assetTypeIndexLogic.assetTypes.data}
                            onRowClick={assetTypeIndexLogic.onRowClick}
                            onSort={assetTypeIndexLogic.handleSort}
                            filters={assetTypeIndexLogic.filters}
                            noItem="Asset Types"
                        />
                    </Card>
                    <CustomPagination
                        data={assetTypeIndexLogic.assetTypes}
                        onPaginationChange={
                            assetTypeIndexLogic.onPaginationChange
                        }
                    />
                </div>
            </div>
        </>
    );
}

AssetTypesIndex.layout = (page) => <Dashboard children={page} />;
export default AssetTypesIndex;
