# Bin Hashim - Premium E-Commerce Platform

A production-ready, mobile-first e-commerce platform built for selling premium bags and fashion accessories at affordable prices.

## Features

### Customer Features
- Beautiful, premium UI with luxury aesthetics
- Mobile-first responsive design
- Product browsing with filters and sorting
- Advanced product search and categorization
- Shopping cart with persistent storage
- Secure checkout process
- Order tracking and confirmation
- Instagram integration for social proof
- WhatsApp order notifications

### Admin Features
- Secure admin authentication
- Comprehensive dashboard with analytics
- Product management (CRUD operations)
- Order management with status tracking
- Inventory management
- Order state machine with validation
- WhatsApp message integration

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Icons:** Lucide React

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Layouts
│   ├── product/         # Product components
│   └── ui/              # Reusable UI components
├── pages/
│   ├── admin/           # Admin pages
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   └── OrderConfirmation.tsx
├── store/               # Zustand stores
├── utils/               # Utility functions
└── lib/                 # Configuration files

```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Razorpay account (for payments)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY=your_razorpay_key
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Database Schema

The application uses the following main tables:
- **products** - Product catalog with images, pricing, and metadata
- **categories** - Product categories
- **orders** - Customer orders
- **order_items** - Order line items
- **admin_users** - Admin authentication

## Order State Machine

Orders follow a strict state machine pattern:
- `pending` → `confirmed` → `shipped` → `delivered`

Invalid transitions are automatically prevented.

## Key Features Implementation

### Recommendation Engine
The system recommends products based on:
- Category similarity
- Price range proximity
- Material and color matching
- Popularity metrics

### WhatsApp Integration
Automatic WhatsApp notifications for:
- Order confirmation
- Order status updates
- Shipping notifications

### Security
- Row Level Security (RLS) enabled on all tables
- Admin-only access to sensitive operations
- Protected admin routes
- Secure authentication flow

## Admin Access

To create an admin user, insert a record in the `admin_users` table after creating a user through Supabase Auth:

```sql
INSERT INTO admin_users (id, name, email, avatar_url)
VALUES ('user-id-from-auth-users', 'Admin Name', 'admin@example.com', null);
```

## Best Practices Followed

1. **Mobile-First Design** - All layouts optimized for mobile devices
2. **Component Reusability** - Modular UI components
3. **Type Safety** - Full TypeScript coverage
4. **Performance** - Lazy loading, optimized images, efficient queries
5. **Security** - RLS policies, input validation, secure API calls
6. **Scalability** - Clean architecture, separation of concerns

## Future Enhancements

- Payment gateway integration (Razorpay)
- Real-time order tracking
- Customer reviews and ratings
- Wishlist functionality
- Email notifications
- Advanced analytics dashboard
- Multi-language support

## License

All rights reserved - Bin Hashim 2024
