<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\Role;
use Spatie\Permission\Models\Permission;

use Modules\Items\Database\Seeders\ItemsDatabaseSeeder;

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

        $permissions = [
            'view users',
            'edit users',
            'delete users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'tenant_id' => $tenant->id]);

        $adminRole->giveTenantPermissionTo($tenant->id, ['view users']);
        $adminRole->giveTenantPermissionTo($tenant->id, ['edit users']);
        $adminRole->giveTenantPermissionTo($tenant->id, ['delete users']);

        $dummyUser = User::firstOrCreate(
            ['email' => 'aku@aku.aku'],
            [
                'name' => 'aku',
                'password' => bcrypt('akuaku'),
                'tenant_id' => $tenant->id,
            ]
        );

        $dummyUser->assignRole($tenant->id, $adminRole);

        $this->call([ItemsDatabaseSeeder::class]);
    }
}
