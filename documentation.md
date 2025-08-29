# Asset Management System Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Modules](#modules)
   - [Asset Module](#asset-module)
   - [Loans Module](#loans-module)
   - [Employee Module](#employee-module)
   - [Profile Module](#profile-module)
4. [Database Schema](#database-schema)
5. [Frontend Architecture](#frontend-architecture)
6. [Authentication & Authorization](#authentication--authorization)
7. [Multitenancy Implementation](#multitenancy-implementation)
8. [API Endpoints](#api-endpoints)

## Overview

The Asset Management System is a multi-tenant Laravel application built with modular architecture. It provides comprehensive asset tracking, loan management, and employee management capabilities. The system is designed to manage company assets across multiple tenants, each with their own isolated data.

## System Architecture

The application follows a modular monolithic architecture using the Laravel framework with the following key components:

- **Backend**: Laravel 12.0 PHP Framework with modular structure
- **Frontend**: React.js 18.3.1 with Inertia.js for server-side rendering
- **Database**: MySQL with multitenancy support
- **Authentication**: Laravel's built-in authentication with Spatie permissions
- **Styling**: Tailwind CSS 4.1.11 with Radix UI components
- **Build Tool**: Vite 6.2.4
- **Additional Libraries**: Intervention Image, Maatwebsite Excel, Ziggy for route generation

### Key Features

- Multi-tenant architecture with data isolation
- Modular code organization for maintainability
- Role-based access control with granular permissions
- Tenant invitation system for user onboarding
- Asset lifecycle management (creation, assignment, repair, disposal)
- Loan management system for asset borrowing
- Employee management with position tracking
- Asset import/export functionality using Excel
- Image handling and processing capabilities
- Comprehensive reporting and dashboard

## Modules

### Asset Module

The Asset module is the core component of the system, responsible for managing all physical assets.

#### Components

1. **Models**:
   - `Asset`: Represents physical assets with properties like serial code, brand, specification, purchase date, etc.
   - `AssetType`: Categorizes assets into types (e.g., laptops, vehicles, equipment)
   - `Location`: Tracks physical locations of assets
   - `Repair`: Manages repair records for assets
   - `AssetLog`: Tracks all changes and activities related to assets

2. **Controllers**:
   - `AssetController`: Handles CRUD operations for assets
   - `AssetTypeController`: Manages asset types
   - `RepairController`: Manages repair records
   - `AssetImportController`: Handles asset import/export functionality

3. **Services**:
   - `AssetService`: Business logic for asset management
   - `AssetTypeService`: Business logic for asset type management
   - `RepairService`: Business logic for repair management
   - `LocationService`: Business logic for location management
   - `AssetLogService`: Business logic for asset logging

4. **Frontend Pages**:
   - `AssetsIndex`: Main asset listing page with filtering and search
   - `AssetsAdd`: Form for adding new assets
   - `AssetsEdit`: Form for editing existing assets
   - `AssetsDetails`: Detailed view of asset information
   - `AssetTypesIndex`: Asset type listing
   - `AssetTypesAdd`: Form for adding new asset types
   - `AssetTypesEdit`: Form for editing asset types
   - `AssetTypesDetails`: Detailed view of asset type information
   - `RepairIndex`: Repair records listing
   - `RepairAdd`: Form for adding new repair records
   - `RepairEdit`: Form for editing repair records
   - `RepairDetails`: Detailed view of repair information

#### Database Schema

The Asset module uses several database tables:

1. **asset_types**:
   - `id`: Primary key
   - `name`: Name of the asset type
   - `model`: Model of the asset type
   - `tenant_id`: Foreign key to tenant
   - `created_by`, `updated_by`, `deleted_by`: Audit fields
   - `timestamps`: Created/updated timestamps
   - `softDeletes`: Soft delete support

2. **assets**:
   - `id`: Primary key
   - `asset_type_id`: Foreign key to asset type
   - `location_id`: Foreign key to location
   - `tenant_id`: Foreign key to tenant
   - `serial_code`: Unique serial code
   - `brand`: Brand name
   - `specification`: Technical specifications
   - `purchase_date`: Date of purchase
   - `purchase_price`: Purchase price
   - `initial_condition`: Initial condition (new/used/defect)
   - `condition`: Current condition (good/used/defect)
   - `availability`: Current availability status (available/pending/loaned/repair)
   - `created_by`, `updated_by`, `deleted_by`: Audit fields
   - `timestamps`: Created/updated timestamps
   - `softDeletes`: Soft delete support

3. **locations**:
   - `id`: Primary key
   - `name`: Location name
   - `address`: Physical address
   - `tenant_id`: Foreign key to tenant
   - `created_by`, `updated_by`, `deleted_by`: Audit fields
   - `timestamps`: Created/updated timestamps
   - `softDeletes`: Soft delete support

4. **repairs**:
   - `id`: Primary key
   - `asset_id`: Foreign key to asset
   - `location_id`: Foreign key to location
   - `tenant_id`: Foreign key to tenant
   - `repair_start_date`: Start date of repair
   - `repair_completion_date`: Completion date of repair
   - `defect_description`: Description of the defect
   - `corrective_action`: Corrective action taken
   - `repair_cost`: Cost of repair
   - `vendor`: Repair vendor
   - `status`: Repair status (progress/completed/cancelled)
   - `created_by`, `updated_by`, `deleted_by`: Audit fields
   - `timestamps`: Created/updated timestamps
   - `softDeletes`: Soft delete support

5. **asset_logs**:
   - `id`: Primary key
   - `asset_id`: Foreign key to asset
   - `user_id`: Foreign key to user
   - `action`: Action performed
   - `description`: Description of the action
   - `tenant_id`: Foreign key to tenant
   - `created_at`, `updated_at`: Timestamps

### Loans Module

The Loans module manages the borrowing and returning of assets.

#### Components

1. **Models**:
   - `Loan`: Represents a loan transaction with borrower information

2. **Controllers**:
   - `LoansController`: Handles CRUD operations for loans

3. **Services**:
   - `LoanService`: Business logic for loan management

4. **Frontend Pages**:
    - `LoansIndex`: Main loan listing page
    - `LoansIndex copy`: Backup copy of loan listing page
    - `LoansAdd`: Form for creating new loans
    - `LoansForm`: Alternative form for loan creation/editing
    - `LoansEdit`: Form for editing existing loans
    - `LoansDetail`: Detailed view of loan information

#### Database Schema

1. **loans**:
   - `id`: Primary key
   - `user_id`: Foreign key to user (borrower)
   - `name`: Loan name/description
   - `description`: Detailed description
   - `status`: Loan status
   - `evident`: Evidence of loan
   - `document`: Related documents
   - `tenant_id`: Foreign key to tenant
   - `timestamps`: Created/updated timestamps
   - `softDeletes`: Soft delete support

2. **asset_loan** (pivot table):
   - `asset_id`: Foreign key to asset
   - `loan_id`: Foreign key to loan
   - `loaned_date`: Date when asset was loaned
   - `return_date`: Date when asset was returned
   - `loaned_condition`: Condition when loaned
   - `return_condition`: Condition when returned
   - `loaned_status`: Status of the loan
   - `timestamps`: Created/updated timestamps

### Employee Module

The Employee module manages user accounts, their relationships to tenants, and provides tenant invitation functionality.

#### Components

1. **Models**:
    - `Mail`: Handles tenant invitations between users (sender/receiver system)

2. **Controllers**:
    - `EmployeeController`: Handles employee management
    - `MailController`: Manages tenant invitations (send, accept, decline)

3. **Services**:
    - `EmployeeService`: Business logic for employee management
    - `MailService`: Business logic for mail/invitation management

4. **Frontend Pages**:
    - `EmployeesIndex`: Employee listing
    - `EmployeesAdd`: Form for adding employees
    - `EmployeesCreate`: Form for creating employees
    - `EmployeesInbox`: Employee inbox for viewing received invitations
    - `EmployeesPermission`: Permission management
    - `EmployeesAssignPermission`: Assign permissions to employees
    - `MailDetail`: Detailed view of individual invitation messages

#### Database Schema

1. **mails**:
    - `id`: Primary key
    - `sender_id`: Foreign key to users table (sender of invitation)
    - `receiver_id`: Foreign key to users table (receiver of invitation)
    - `status`: Enum field with values ('accepted', 'rejected', 'pending') - default 'pending'
    - `tenant_id`: Foreign key to tenant (tenant being invited to)
    - `timestamps`: Created/updated timestamps

### Profile Module

The Profile module manages user profile settings.

#### Components

1. **Controllers**:
   - `ProfileController`: Handles profile management

2. **Frontend Pages**:
   - `ProfileIndex`: Profile overview
   - `ProfileEdit`: Profile editing form

## Database Schema

The application uses a MySQL database with the following key tables:

### Core Tables

1. **users**:
   - `id`: Primary key
   - `name`: User's name
   - `email`: User's email
   - `password`: Hashed password
   - `picture`: Profile picture
   - `phone`: Phone number
   - `bio`: User biography
   - `address`: User address
   - `position_id`: Foreign key to position
   - `timestamps`: Created/updated timestamps
   - `email_verified_at`: Email verification timestamp
   - `remember_token`: Remember me token

2. **tenants**:
   - `id`: Primary key
   - `name`: Tenant name
   - `domain`: Tenant domain
   - `database`: Database name
   - `email`: Contact email
   - `phone`: Contact phone
   - `address`: Tenant address
   - `industry`: Industry type
   - `website`: Website URL
   - `description`: Tenant description
   - `pictures`: Tenant pictures
   - `timestamps`: Created/updated timestamps

3. **positions**:
   - `id`: Primary key
   - `name`: Position name
   - `tenant_id`: Foreign key to tenant
   - `timestamps`: Created/updated timestamps

4. **tenant_user** (pivot table):
   - `user_id`: Foreign key to user
   - `tenant_id`: Foreign key to tenant
   - `timestamps`: Created/updated timestamps

5. **position_user** (pivot table):
   - `user_id`: Foreign key to user
   - `position_id`: Foreign key to position
   - `tenant_id`: Foreign key to tenant
   - `timestamps`: Created/updated timestamps

### Authentication Tables

The application uses Spatie Laravel Permission package for role-based access control:

1. **roles**:
   - `id`: Primary key
   - `name`: Role name
   - `guard_name`: Guard name
   - `tenant_id`: Foreign key to tenant
   - `timestamps`: Created/updated timestamps

2. **permissions**:
   - `id`: Primary key
   - `name`: Permission name
   - `guard_name`: Guard name
   - `tenant_id`: Foreign key to tenant
   - `timestamps`: Created/updated timestamps

3. **model_has_roles**:
   - `role_id`: Foreign key to role
   - `model_type`: Model type
   - `model_id`: Model ID
   - `tenant_id`: Foreign key to tenant

4. **model_has_permissions**:
   - `permission_id`: Foreign key to permission
   - `model_type`: Model type
   - `model_id`: Model ID
   - `tenant_id`: Foreign key to tenant

5. **role_has_permissions**:
   - `permission_id`: Foreign key to permission
   - `role_id`: Foreign key to role
   - `tenant_id`: Foreign key to tenant

## Frontend Architecture

The frontend is built with React.js and uses Inertia.js for server-side rendering. The application follows a component-based architecture with the following key elements:

### Main Components

1. **Layout Components**:
   - `Dashboard`: Main dashboard layout
   - `AppLayout`: Application wrapper layout

2. **UI Components**:
   - Various reusable UI components built with Radix UI and Tailwind CSS
   - Custom data table components for listing data
   - Form components for data entry
   - Navigation components for routing

3. **Hooks**:
   - Custom React hooks for managing component state and logic
   - Data fetching hooks for API integration

### Routing

The frontend uses Inertia.js routing which maps to Laravel backend routes. The main routes include:

- `/dashboard`: Main dashboard
- `/dashboard/assets`: Asset management section
- `/dashboard/assettypes`: Asset type management
- `/dashboard/repairs`: Repair management
- `/dashboard/loans`: Loan management
- `/dashboard/employees`: Employee management
- `/dashboard/inbox`: Tenant invitation inbox
- `/dashboard/profile`: User profile

### State Management

The application uses React's built-in state management with Inertia.js for server-side state synchronization. Data is passed from Laravel controllers to React components via Inertia's page props.

## Authentication & Authorization

The application uses Laravel's built-in authentication system with Spatie Laravel Permission for role-based access control.

### Authentication Flow

1. User visits login page
2. Credentials are validated against users table
3. On successful authentication, user session is created
4. User is redirected to dashboard

### Authorization System

The application implements a granular permission system:

1. **Roles**:
   - Predefined roles with specific permissions
   - Roles are tenant-specific

2. **Permissions**:
   - Granular permissions for specific actions
   - Permissions are assigned to roles
   - Users inherit permissions through roles

3. **Permission Checking**:
   - Permissions are checked in controllers before allowing actions
   - Unauthorized users are redirected to dashboard

## Multitenancy Implementation

The application implements multitenancy using the Spatie Laravel Multitenancy package with the following characteristics:

### Tenant Isolation

1. **Database Isolation**:
   - Each tenant has its own database
   - Tenant data is completely isolated

2. **Model Scoping**:
   - Models use global scopes to automatically filter by tenant
   - Tenant ID is automatically added to new records

3. **Session Management**:
   - Tenant context is stored in user session
   - Users can switch between tenants they belong to

### Tenant Management

1. **Tenant Creation**:
   - New tenants are created with their own database
   - Default data is seeded for new tenants

2. **User Assignment**:
   - Users are assigned to tenants via many-to-many relationship
   - Users can belong to multiple tenants

3. **Tenant Switching**:
    - Users can switch between tenants they have access to
    - Session context is updated when switching tenants

## Tenant Invitation System

The application includes a comprehensive tenant invitation system that allows users to invite others to join their tenants.

### Features

1. **Invitation Workflow**:
    - Users can send invitations to other registered users to join their tenant
    - Recipients receive invitations in their inbox
    - Recipients can accept or decline invitations
    - Upon acceptance, users are automatically added to the inviting tenant

2. **Invitation Management**:
    - Invitations have three states: pending, accepted, rejected
    - Users can view all received invitations in their inbox
    - Detailed view of individual invitations with sender information
    - Real-time status updates

3. **Security & Permissions**:
    - Only the invitation recipient can accept/decline their invitations
    - Users cannot accept invitations for tenants they're already members of
    - Automatic tenant association upon acceptance

### User Flow

1. **Sending Invitations**:
    - Tenant member accesses invitation form
    - Selects recipient email from registered users
    - Submits invitation which creates a mail record

2. **Receiving Invitations**:
    - Recipient sees invitation in their inbox
    - Can view invitation details
    - Can accept (joins tenant) or decline (rejects invitation)

3. **Status Tracking**:
    - Sender can see invitation status
    - Recipient actions update invitation status
    - Historical record of all invitations maintained

## API Endpoints

The application primarily uses server-side rendering with Inertia.js, but also exposes some API endpoints for AJAX requests:

### Asset API

1. `GET /dashboard/assets/api/{assetType}/assets`:
   - Retrieves available assets by asset type
   - Used for dynamic asset selection in forms

### Authentication API

1. `POST /login`:
   - Authenticates user credentials

2. `POST /logout`:
   - Logs out current user

3. `POST /switch/{tenantId}`:
   - Switches user's active tenant context

### Dashboard API

1. `GET /dashboard`:
    - Retrieves dashboard statistics and data

### Inbox API

1. `GET /dashboard/inbox`:
    - Retrieves paginated list of received invitations for authenticated user

2. `POST /dashboard/inbox/add`:
    - Creates and sends a new tenant invitation

3. `POST /dashboard/inbox/accept/{id}`:
    - Accepts a tenant invitation and adds user to the tenant

4. `DELETE /dashboard/inbox/decline/{id}`:
    - Declines a tenant invitation

5. `GET /dashboard/inbox/detail/{id}`:
    - Retrieves detailed information about a specific invitation

## Deployment

The application can be deployed using the standard Laravel deployment process:

1. Install PHP dependencies with Composer
2. Install JavaScript dependencies with NPM
3. Build frontend assets with Vite
4. Configure environment variables
5. Run database migrations
6. Seed initial data if needed

## Development

To set up the development environment:

1. Clone the repository
2. Install PHP dependencies: `composer install`
3. Install JavaScript dependencies: `npm install`
4. Copy `.env.example` to `.env` and configure database settings
5. Generate application key: `php artisan key:generate`
6. Run database migrations: `composer run migrate-all` (runs both landlord and tenant migrations)
7. (Optional) Seed the database: `composer run migrate-and-seed-all`
8. Start all development services: `composer run dev` (starts Laravel server, queue worker, logs, and Vite)
9. Or start services individually:
   - Start Laravel server: `php artisan serve`
   - Start Vite development server: `npm run dev`
   - Start queue worker: `php artisan queue:listen --tries=1`
   - View logs: `php artisan pail --timeout=0`

## Testing

The application includes both feature and unit tests:

1. Run all tests: `php artisan test`
2. Run feature tests: `php artisan test --testsuite=Feature`
3. Run unit tests: `php artisan test --testsuite=Unit`

## Contributing

To contribute to the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

## License

The application is proprietary software. All rights reserved.