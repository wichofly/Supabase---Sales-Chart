import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

type MetricProps = {
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

        setMetrics(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl p-4 sm:p-8">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">
          Total Sales This Quarter ($)
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Employees: {metrics.length}
        </p>

        <div className="mt-6 flex h-64 items-center justify-center rounded-lg bg-emerald-50 p-4 text-center text-gray-500">
          <p>Sales chart will appear here.</p>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
