import React from "react";
import { Head } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

function DashboardIndex() {
    return (
        <div>
            <Head title="Check" />
            <h1 className="text-xl font-bold">kjhjgg</h1>
            <p>This is Dashboard Homes</p>
        </div>
    );
}

DashboardIndex.layout = (page) => <Dashboard children={page} />;

export default DashboardIndex;
