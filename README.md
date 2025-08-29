# CBN - Inventory System

A multi-tenant business management system built with Laravel 12 and Inertia React, designed to streamline asset management, employee administration, and loan processing for organizations.

## Features

### 🏢 Asset Management
- **Asset Types**: Categorize and organize different types of assets
- **Asset Tracking**: Complete lifecycle management of company assets
- **Repair Management**: Track maintenance and repair history
- **Asset Logs**: Comprehensive audit trail for all asset activities

### 👥 Employee Management
- **Employee Profiles**: Complete employee information management
- **User-based Access**: Permission system for secure access control

### 💰 Loan Management
- **Loan Processing**: Streamlined loan application and approval workflow
- **Loan Tracking**: Monitor loan status and repayment schedules

### 🔐 Multi-Tenant Architecture
- **Tenant Isolation**: Secure data separation between organizations
- **Scalable Design**: Support for multiple organizations on single instance

### 🛠️ Technical Features
- **Modern UI**: React-based frontend with Tailwind CSS and Shadcn UI components
- **Excel Integration**: Import/export capabilities for bulk asset operations
- **Image Processing**: Built-in image manipulation and storage
- **Real-time Updates**: Live data synchronization across the application
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18 with Inertia.js
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Shadcn UI
- **Build Tool**: Vite
- **Permissions**: Spatie Laravel Permission
- **Multi-tenancy**: Spatie Laravel Multitenancy
- **Modules**: Laravel Modules by nWidart

## Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- PostgreSQL 12+ or Docker
- Git

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CBN
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Install Node.js Dependencies
```bash
npm install
```

### 4. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Update .env file with database credentials
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=CBN
DB_USERNAME=CBN
DB_PASSWORD=passwordcbn
```

#### Option B: Local PostgreSQL Installation
Create a PostgreSQL database and update the `.env` file with your database credentials.

### 6. Database Migration and Seeding
```bash
# Run migrations for landlord (central database)
php artisan migrate:fresh --path=database/migrations/landlord

# Run tenant migrations and Seed the database
composer migrate-and-seed-all
```

### 7. Build Frontend Assets
```bash
# For development
npm run dev

# For production
npm run build
```

### 8. Start the Application
```bash
# Start all services (Laravel server, queue worker, logs, and Vite dev server)
composer run dev
```

## Usage

### Accessing the Application
- **Main Application**: http://localhost:8000
- **pgAdmin**: http://localhost:5050 (if using Docker)
  - Email: CBN@admin.com
  - Password: cbncbncbn

### Default Credentials
After seeding the database, you can log in with:
- **Email**: admin@example.com
- **Password**: password

## Available Commands

```bash
# Development server with all services
composer run dev

# Database operations
composer run migrate-and-seed-all

# Code formatting
./vendor/bin/pint                
```

## Project Structure

```
CBN/
├── app/                    # Laravel application code
├── Modules/               # Modular architecture
│   ├── Asset/            # Asset management module
│   ├── Employee/         # Employee management module
│   ├── Loans/            # Loan management module
│   └── Profile/          # User profile module
├── database/             # Database migrations and seeders
├── public/               # Public web assets
├── resources/            # Views and frontend resources
│   ├── js/              # React application
│   └── css/             # Stylesheets
├── routes/               # Route definitions
├── storage/              # File storage
├── tests/                # Test files
└── docker-compose.yaml   # Docker configuration
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.