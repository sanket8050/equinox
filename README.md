# Equinox - Advanced Group Expense Tracker

A comprehensive full-stack application for managing group expenses and donations, built with Next.js, Prisma, and PostgreSQL. Equinox supports both Friends Groups and Organization Groups with advanced features for expense tracking, settlement, and analytics.

## 🌟 Key Features

### 🎯 Dual Mode Support
- **Friends Groups**: Peer-to-peer expense splitting with smart settlement
- **Organization Groups**: Department-wise spending with donation tracking and fund management

### 💰 Advanced Expense Management
- **Equal & Custom Splitting**: Support for both equal shares and custom amounts
- **Department-wise Expenses**: Track spending by department in organization groups
- **Category Classification**: Organize expenses by categories (Food, Transportation, etc.)
- **Partial Payments**: Handle complex payment scenarios with multiple contributors

### 🏢 Organization Features
- **Department Management**: Create and manage departments for organized spending
- **Donation Tracking**: Comprehensive donation system with payment methods
- **Fund Management**: Track collected funds vs. spent amounts
- **Recipient Tracking**: Track who received donations and payments

### ⚖️ Smart Settlement System
- **Minimal Transactions**: Algorithm to minimize number of settlement transactions
- **Real-time Balance Calculation**: Instant balance updates with visual indicators
- **Settlement Recommendations**: Clear guidance on who pays whom
- **Visual Balance Display**: Color-coded balances (green for owed, red for owing)

### 🔔 Real-time Notifications
- **Instant Updates**: Notifications for expenses, donations, and settlements
- **Notification Center**: Comprehensive notification management
- **Real-time Bell**: Notification bell with unread count
- **Email Integration**: Optional email notifications

### 📊 Advanced Analytics
- **Department Analytics**: Spending breakdown by department
- **Payment Method Tracking**: Donation analytics by payment method
- **Visual Charts**: Interactive charts for spending patterns
- **Fund Overview**: Complete financial transparency

### 🔍 Search & Filter System
- **Advanced Filtering**: Filter by date, amount, category, department, member
- **Search Functionality**: Search across transactions and donations
- **Real-time Results**: Instant filter results
- **Saved Filters**: Remember filter preferences

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL (NeonDB), Prisma ORM
- **UI Components**: Radix UI, Lucide React Icons
- **Charts**: Recharts
- **Authentication**: NextAuth.js with Google OAuth

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or NeonDB account)
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd equinox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/xpence_tracker"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main models:

- **User**: User accounts and authentication
- **Group**: Expense groups (Friends/Organization mode)
- **GroupMember**: User-group relationships with roles and balances
- **Transaction**: Individual expenses with participant tracking
- **TransactionParticipant**: Who paid/owed for each transaction
- **InitialContribution**: Initial donations for organization mode
- **Notification**: User alerts and reminders

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Groups
- `GET /api/groups` - Fetch user's groups
- `POST /api/groups` - Create new group
- `GET /api/groups/[id]` - Get group details

### Transactions
- `POST /api/groups/[id]/transactions` - Add expense
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Settlement
- `POST /api/groups/[id]/settle` - Trigger settlement

## Project Structure

```
equinox/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── groups/            # Group management
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   └── lib/
│       ├── auth.ts           # NextAuth configuration
│       ├── prisma.ts         # Prisma client
│       └── utils.ts          # Utility functions
├── package.json
└── README.md
```

## Key Features Implementation

### Smart Settlement Algorithm
The settlement system calculates the minimum number of transactions needed to settle all balances using a debt optimization algorithm.

### Real-time Updates
Uses polling and WebSocket connections to provide real-time updates for transactions and notifications.

### Role-based Access Control
Implements admin/member roles with appropriate permissions for group management and transaction operations.

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:migrate      # Run migrations
npm run db:studio       # Open Prisma Studio

# Linting
npm run lint            # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.