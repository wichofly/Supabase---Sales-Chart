import { useEffect } from 'react';
import { supabase } from '../utils/supabase';

const Dashboard = () => {
  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await supabase
        .from('sales_deals')
        .select(`name, value`)
        .order('value', { ascending: false })
        .limit(1);

      console.log(response);
    };

    fetchMetrics();
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl p-4 sm:p-8">
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">
          Total Sales This Quarter ($)
        </h2>

        <div className="mt-6 flex h-64 items-center justify-center rounded-lg bg-emerald-50 p-4 text-center text-gray-500">
          <p>Sales chart will appear here.</p>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
