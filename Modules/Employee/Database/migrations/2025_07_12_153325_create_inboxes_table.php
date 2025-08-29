<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mails', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sender_id')->constrained('users')->nullOnDelete();
            $table->foreignId('receiver_id')->constrained('users')->nullOnDelete();
            $table->enum('status', ['accepted', 'rejected', 'pending'])->default('pending');

            $table->foreignId('tenant_id')->constrained()->nullOnDelete();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
