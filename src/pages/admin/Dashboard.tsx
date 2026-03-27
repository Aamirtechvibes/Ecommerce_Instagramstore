import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, revenueRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id, status', { count: 'exact' }),
        supabase.from('orders').select('total'),
      ]);

      const totalProducts = productsRes.count || 0;
      const totalOrders = ordersRes.count || 0;
      const pendingOrders = ordersRes.data?.filter((o) => o.status === 'pending').length || 0;
      const totalRevenue = revenueRes.data?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      setStats({ totalProducts, totalOrders, pendingOrders, totalRevenue });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light tracking-wide">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl font-semibold">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-full ${stat.bgColor}`}>
                <stat.icon size={28} className={stat.color} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/products/new">
              <Button fullWidth variant="outline">
                Add New Product
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button fullWidth variant="outline">
                View All Orders
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button fullWidth variant="outline">
                Manage Products
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-medium mb-4">Recent Activity</h2>
          <p className="text-gray-600 text-sm">
            Manage your products and orders efficiently from the admin panel.
          </p>
        </Card>
      </div>
    </div>
  );
};
