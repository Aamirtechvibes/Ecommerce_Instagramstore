/*
  # E-commerce Database Schema for Bin Hashim

  ## Overview
  This migration creates the complete database schema for a premium e-commerce platform
  selling bags and fashion accessories.

  ## New Tables

  ### 1. categories
  - `id` (uuid, primary key)
  - `name` (text) - Category name (e.g., "All Bags", "New In", "Premium Collection")
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Category description
  - `image_url` (text) - Category banner image
  - `display_order` (integer) - Sort order for display
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. products
  - `id` (uuid, primary key)
  - `name` (text) - Product name
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Detailed product description
  - `price` (numeric) - Actual selling price
  - `mrp` (numeric) - Maximum retail price (for discount display)
  - `category_id` (uuid) - Foreign key to categories
  - `color` (text) - Product color
  - `material` (text) - Product material
  - `images` (jsonb) - Array of image URLs
  - `video_url` (text) - Instagram reel or product video URL
  - `stock_quantity` (integer) - Available stock
  - `is_trending` (boolean) - Featured in trending section
  - `is_new_arrival` (boolean) - Featured in new arrivals
  - `is_best_seller` (boolean) - Featured in best sellers
  - `is_top_pick` (boolean) - Featured in today's top 4
  - `tags` (jsonb) - Array of tags (e.g., ["sale", "limited"])
  - `view_count` (integer) - Number of views for popularity
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. orders
  - `id` (uuid, primary key)
  - `order_number` (text, unique) - Human-readable order number
  - `customer_name` (text) - Customer's full name
  - `customer_phone` (text) - Customer's phone number
  - `customer_email` (text) - Customer's email (optional)
  - `shipping_address` (text) - Full shipping address
  - `pincode` (text) - Delivery pincode
  - `subtotal` (numeric) - Total before discounts
  - `discount` (numeric) - Total discount amount
  - `total` (numeric) - Final payable amount
  - `status` (text) - Order status: pending, confirmed, shipped, delivered
  - `payment_method` (text) - Payment method used
  - `payment_id` (text) - Payment gateway transaction ID
  - `tracking_id` (text) - Shipment tracking ID (optional)
  - `notes` (text) - Additional customer notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  - `confirmed_at` (timestamptz)
  - `shipped_at` (timestamptz)
  - `delivered_at` (timestamptz)

  ### 4. order_items
  - `id` (uuid, primary key)
  - `order_id` (uuid) - Foreign key to orders
  - `product_id` (uuid) - Foreign key to products
  - `product_name` (text) - Product name at time of order
  - `product_image` (text) - Primary product image
  - `quantity` (integer) - Quantity ordered
  - `price` (numeric) - Price per item at time of order
  - `subtotal` (numeric) - quantity * price
  - `created_at` (timestamptz)

  ### 5. admin_users
  - `id` (uuid, primary key, references auth.users)
  - `name` (text) - Admin name
  - `email` (text, unique) - Admin email
  - `avatar_url` (text) - Admin profile picture
  - `created_at` (timestamptz)

  ## Security

  All tables have Row Level Security (RLS) enabled with appropriate policies:
  - Products and categories are publicly readable
  - Orders are only accessible to admin users
  - Admin users table is only accessible to authenticated admins
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  mrp numeric(10,2),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  color text,
  material text,
  images jsonb DEFAULT '[]'::jsonb,
  video_url text,
  stock_quantity integer DEFAULT 0,
  is_trending boolean DEFAULT false,
  is_new_arrival boolean DEFAULT false,
  is_best_seller boolean DEFAULT false,
  is_top_pick boolean DEFAULT false,
  tags jsonb DEFAULT '[]'::jsonb,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  shipping_address text NOT NULL,
  pincode text NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  discount numeric(10,2) DEFAULT 0,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  payment_id text,
  tracking_id text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered'))
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text,
  quantity integer NOT NULL,
  price numeric(10,2) NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_trending ON products(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = true;
CREATE INDEX IF NOT EXISTS idx_products_best_seller ON products(is_best_seller) WHERE is_best_seller = true;
CREATE INDEX IF NOT EXISTS idx_products_top_pick ON products(is_top_pick) WHERE is_top_pick = true;
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- RLS Policies for orders (admin only)
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- RLS Policies for order_items (admin only, auto-created with orders)
CREATE POLICY "Admins can view order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for admin_users (admins only)
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_number text;
BEGIN
  SELECT 'BH' || TO_CHAR(now(), 'YYYYMMDD') || LPAD(NEXTVAL('order_number_seq')::text, 4, '0')
  INTO new_number;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Insert default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('All Bags', 'all-bags', 'Browse our complete collection of premium bags', 1),
  ('New In', 'new-in', 'Latest arrivals fresh from our collection', 2),
  ('Premium Collection', 'premium-collection', 'Luxury-inspired designer bags', 3),
  ('Signature Styles', 'signature-styles', 'Our most iconic and sought-after designs', 4)
ON CONFLICT (slug) DO NOTHING;