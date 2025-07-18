<?php

namespace Database\Seeders;

use App\Models\Position;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\Role;
use Modules\Asset\Database\Seeders\AssetDatabaseSeeder;
use Modules\Employee\Database\Seeders\EmployeeDatabaseSeeder;
use Modules\Loans\Database\Seeders\LoansDatabaseSeeder;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $tenant = Tenant::create([
            'name' => "Admin",
            'domain' => "Admin",
            'database' => "Admin",
        ]);

        $position = Position::create([
            'name' => "Admin",
            'tenant_id' => $tenant->id
        ]);

        $permissions = [
            'view users',
            'edit users',
            'delete users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'admin',
            ]);
        }

        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'tenant_id' => $tenant->id,
            'guard_name' => 'admin',
        ]);

        $adminRole->giveTenantPermissionTo($tenant->id, ['view users']);
        $adminRole->giveTenantPermissionTo($tenant->id, ['edit users']);
        $adminRole->giveTenantPermissionTo($tenant->id, ['delete users']);

        $admin = User::firstOrCreate(
            ['email' => 'aku@aku.aku'],
            [
                'name' => 'aku',
                'password' => bcrypt('akuaku'),
                'position' => $position->id,
            ]
        );

        $admin->assignRole($tenant->id, $adminRole);

        $this->call([AssetDatabaseSeeder::class]);
        $this->call([EmployeeDatabaseSeeder::class]);
        $this->call([LoansDatabaseSeeder::class]);
    }
}
