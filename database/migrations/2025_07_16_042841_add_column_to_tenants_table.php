<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('description')->nullable();
            $table->string('industry')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('address')->nullable();
            $table->string('pictures')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn('description')->nullable();
            $table->dropColumn('industry')->nullable();
            $table->dropColumn('phone')->nullable();
            $table->dropColumn('email')->nullable();
            $table->dropColumn('website')->nullable();
            $table->dropColumn('address')->nullable();
            $table->dropColumn('pictures')->nullable();
        });
    }
};
