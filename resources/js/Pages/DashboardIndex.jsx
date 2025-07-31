import React from "react";

import { Head } from "@inertiajs/react";

import Dashboard from "@components/layout/Dashboard";

function DashboardIndex() {
    return (

        <div>
            <Head title="Check" />
            <h1 className="text-xl font-bold">CBN Inventory System</h1>
            <p>
                untuk dashboard tampilkan :
                <br />
                1. Total Aset Terdaftar: Jumlah keseluruhan laptop, handphone,
                dan tablet yang ada dalam sistem.
                <br />
                2. Aset Tersedia: Berapa banyak aset yang siap dipinjamkan atau
                digunakan.
                <br />
                3. Aset Dipinjam: Jumlah aset yang sedang berada di tangan
                karyawan.
                <br />
                4. Aset dalam Perbaikan: Berapa banyak aset yang sedang
                diperbaiki.
                <br />
                5. Aset Rusak/Tidak Aktif: Jumlah aset yang tidak bisa
                digunakan.
            </p>
        </div>
    );
}

DashboardIndex.layout = (page) => <Dashboard children={page} />;

export default DashboardIndex;
