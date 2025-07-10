<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

use Modules\Items\Database\Seeders\ItemsDatabaseSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        $dummyUser = User::firstOrCreate(
            ['email' => 'aku@aku.aku'],
            [
                'name' => 'aku',
                'password' => bcrypt('akuaku'),
            ]
        );

        $dummyUser->assignRole($userRole);

        $this->call([ItemsDatabaseSeeder::class]);
    }
}
