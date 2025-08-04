import React from "react";

import { Head, usePage } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";
import {
    Package,
    CheckCircle,
    ArrowRightLeft,
    Wrench,
    CircleSlash,
    Users,
    Calendar,
    Info,
    Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function DashboardIndex() {
    const {
        totalAssets,
        totalAvailableAssets,
        totalDefectAssets,
        totalLoanedAssets,
        recentLoanedAssets,
        totalAssetsInRepair,
        recentAssetsInRepair,
        recentEmployees,
        tenant
    } = usePage().props;

    const formatDateNoHour = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            return "-";
        }
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <Head title={tenant.name} />
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        title="Total Assets"
                        value={totalAssets}
                        icon={Package}
                        description="Overall assets registered"
                    />
                    <StatCard
                        title="Available"
                        value={totalAvailableAssets}
                        icon={CheckCircle}
                        description="Ready for loan"
                    />
                    <StatCard
                        title="On Loan"
                        value={totalLoanedAssets}
                        icon={ArrowRightLeft}
                        description="Currently loaned out"
                    />
                    <StatCard
                        title="In Repair"
                        value={totalAssetsInRepair}
                        icon={Wrench}
                        description="Under maintenance"
                    />
                    <StatCard
                        title="Defective"
                        value={totalDefectAssets}
                        icon={CircleSlash}
                        description="Unusable assets"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ArrowRightLeft className="w-5 h-5 text-primary" />
                                Recent Loaned Assets
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentLoanedAssets &&
                            recentLoanedAssets.length > 0 ? (
                                <div className="space-y-3">
                                    {recentLoanedAssets.map((asset) => (
                                        <div
                                            key={asset.serial_code}
                                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/40"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {asset.brand} (
                                                    {asset.serial_code})
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {formatDateNoHour(
                                                        asset.loans[0]
                                                            ?.created_at
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="No recent loaned assets." />
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Wrench className="w-5 h-5 text-primary" />
                                Recent Assets in Repair
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentAssetsInRepair &&
                            recentAssetsInRepair.length > 0 ? (
                                <div className="space-y-3">
                                    {recentAssetsInRepair.map((asset) => (
                                        <div
                                            key={asset.serial_code}
                                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/40"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {asset.brand} (
                                                    {asset.serial_code})
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span>
                                                    Last Updated:{" "}
                                                    {formatDateNoHour(
                                                        asset.updated_at
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyState message="No recent assets in repair." />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="w-5 h-5 text-purple-600" />
                            Recent Employees
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentEmployees && recentEmployees.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {recentEmployees.map((employee) => (
                                    <div
                                        key={employee.id}
                                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/40"
                                    >
                                        <Avatar className="h-10 w-10 rounded-md">
                                            <AvatarImage
                                                src={`/storage/${employee.picture}`}
                                                alt={employee.name}
                                            />
                                            <AvatarFallback className="rounded-md text-sm font-medium">
                                                {getInitials(employee.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {employee.name}
                                            </span>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                Joined:{" "}
                                                {formatDateNoHour(
                                                    employee.pivot.created_at
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="No recent employees." />
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

const StatCard = ({ title, value, icon: Icon, description }) => (
    <Card className="p-4 flex flex-col items-start justify-between h-full">
        <div className="flex items-center gap-3 mb-2">
            <div
                className={`p-2 rounded-md text-primary bg-primary/10`}
            >
                <Icon className={`w-5 h-5`} />
            </div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {title}
            </h3>
        </div>
        <div className="flex flex-col">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {value}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description}
            </p>
        </div>
    </Card>
);

const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
        <Info className="w-8 h-8 mb-3" />
        <p className="text-sm">{message}</p>
    </div>
);

DashboardIndex.layout = (page) => <Dashboard children={page} />;

export default DashboardIndex;
