<?php

namespace Modules\Items\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Items\Models\Item;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class ItemsDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view items',
            'edit items',
            'delete items',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $user = Role::firstOrCreate(['name' => 'user']);
        $user->givePermissionTo(['view items']);
        $user->givePermissionTo(['edit items']);
        $user->givePermissionTo(['delete items']);

        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);

        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);

        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);
        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);
        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);
        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);
        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);
        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);
        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);
        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);
        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);
        Item::create([
            'name' => 'Laptop',
            'price' => 5000,
            'stock' => 2,
        ]);
    }
}
