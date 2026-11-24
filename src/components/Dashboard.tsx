import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { supabase } from '../utils/supabase';
import Form from './Form';

export type MetricProps = {
  name: string;
  sum: number;
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState<MetricProps[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('sales_deals')
          .select(`name, value.sum()`);

        if (error) throw error;

        console.log(data);
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();

    const channel = supabase
      .channel('deal-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales_deals',
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchMetrics();
        },
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-8">
      <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Total Sales This Quarter ($)
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Employees: {metrics.length}
        </p>

        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis
                width={80}
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
              />
              <Tooltip
                formatter={(value) => `$${Number(value).toLocaleString()}`}
              />
              <Bar
                dataKey="sum"
                name="Total sales"
                fill="#059669"
                radius={[4, 4, 0, 0]}
                maxBarSize={80}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <Form metrics={metrics} />
    </main>
  );
};

export default Dashboard;
