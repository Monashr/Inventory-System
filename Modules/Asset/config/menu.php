<?php

return [
    [
        'title' => 'Assets',
        'icon' => 'PackageIcon',
        'route' => '/dashboard/assets',
        'permission' => 'view assets',
        'children' => [
            [
                'title' => 'Asset Types',
                'route' => '/dashboard/assettypes',
                'permission' => 'view assets',
            ],
            [
                'title' => 'Asset',
                'route' => '/dashboard/assets',
                'permission' => 'view assets',
            ],
            [
                'title' => 'Repairs',
                'route' => '/dashboard/repairs',
                'permission' => 'repair assets',
            ],
        ],
    ]
];
