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
        Schema::create('asset_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('model');
            $table->foreignId('tenant_id')->constrained()->nullOnDelete();
            $table->foreignId('created_by')->nullable();
            $table->foreignId('updated_by')->nullable();
            $table->foreignId('deleted_by')->nullable();

            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('deleted_by')->references('id')->on('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_type_id')->constrained()->nullOnDelete();
            $table->foreignId('location_id')->constrained()->nullOnDelete();
            $table->foreignId('tenant_id')->constrained()->nullOnDelete();
            $table->string('serial_code')->unique();
            $table->string('brand')->nullable();
            $table->text('specification')->nullable();
            $table->dateTime('purchase_date')->nullable();
            $table->decimal('purchase_price')->nullable();
            $table->enum('initial_condition', ['new', 'used', 'defect'])->default('new');
            $table->enum('condition', ['good', 'used', 'defect'])->default('good');
            $table->enum('availability', ['available', 'pending', 'loaned', 'repair'])->default('available');
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
        Schema::dropIfExists('asset_types');

        Schema::dropIfExists('assets');
    }
};
