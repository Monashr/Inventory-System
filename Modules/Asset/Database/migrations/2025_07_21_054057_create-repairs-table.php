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
        Schema::create('repairs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->nullOnDelete();
            $table->foreignId('tenant_id')->constrained()->nullOnDelete();
            $table->dateTime('repair_start_date')->nullable();
            $table->dateTime('repair_completion_date')->nullable();
            $table->text('defect_description')->nullable();
            $table->string('corrective_action')->unique();
            $table->decimal('repair_cost')->nullable();
            $table->string('vendor')->nullable();
            $table->enum('status', ['progress', 'completed', 'cancelled'])->default('progress');
            $table->foreignId('created_by')->nullable();
            $table->foreignId('updated_by')->nullable();
            $table->foreignId('deleted_by')->nullable();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
