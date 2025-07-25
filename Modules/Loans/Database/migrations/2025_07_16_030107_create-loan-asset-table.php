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
        Schema::create('asset_loan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->nullOnDelete();
            $table->foreignId('loan_id')->constrained()->nullOnDelete();
            $table->dateTime('loaned_date');
            $table->dateTime('return_date')->nullable();
            $table->enum('loaned_status', ['loaned', 'returned'])->nullable();
            $table->enum('loaned_condition', ['good', 'used', 'defect'])->default('good')->nullable();
            $table->enum('return_condition', ['good', 'used', 'defect'])->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreignId('created_by')->nullable();
            $table->foreignId('updated_by')->nullable();
            $table->foreignId('deleted_by')->nullable();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
