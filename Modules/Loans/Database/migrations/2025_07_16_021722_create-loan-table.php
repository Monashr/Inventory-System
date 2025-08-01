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
        Schema::create('loans', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->text('evident')->nullable();
            $table->text('document')->nullable();
            $table->foreignId('user_id')->constrained()->nullOnDelete();
            $table->foreignId('tenant_id')->constrained()->nullOnDelete();
            $table->enum('status', ['accepted', 'pending', 'rejected', 'cancelled'])->default('pending')->nullable();
            $table->timestamps();
            $table->softDeletes();
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
