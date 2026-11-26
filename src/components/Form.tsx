import { useActionState } from 'react';
import type { SalesMetric } from '../types/sales';
import { supabase } from '../utils/supabase';

type FormProps = {
  metrics: SalesMetric[];
};

function Form({ metrics }: FormProps) {
  const [errorMessage, submitAction, isPending] = useActionState(
    handleAddDeal,
    null,
  );

  async function handleAddDeal(
    _previousError: string | null,
    formData: FormData,
  ): Promise<string | null> {
    const name = formData.get('name');
    const amount = formData.get('value');

    if (
      typeof name !== 'string' ||
      !metrics.some((metric) => metric.name === name)
    ) {
      return 'Please select a sales rep.';
    }

    if (typeof amount !== 'string' || amount.trim() === '') {
      return 'Please enter a sales amount.';
    }

    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      return 'Please enter an amount greater than zero.';
    }

    try {
      const { error: insertError } = await supabase
        .from('sales_deals')
        .insert({ name, value });

      if (insertError) {
        throw insertError;
      }

      console.log('New deal:', { name, value });

      return null;
    } catch (error) {
      console.error('Error adding deal:', error);
      return 'Failed to add deal. Please try again.';
    }
  }

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold text-gray-800">Add a new deal</h2>

      <form
        action={submitAction}
        aria-label="Add new sales deal"
        aria-describedby={errorMessage ? 'deal-error' : undefined}
        className="mt-4 grid gap-4 sm:grid-cols-3 sm:items-end"
      >
        <div>
          <label
            htmlFor="deal-name"
            className="block text-sm font-medium text-gray-700"
          >
            Sales rep
          </label>
          <select
            id="deal-name"
            name="name"
            defaultValue=""
            className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            required
            disabled={isPending || metrics.length === 0}
          >
            <option value="" disabled>
              Select a sales rep
            </option>
            {metrics.map((metric) => (
              <option key={metric.name} value={metric.name}>
                {metric.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="deal-value"
            className="block text-sm font-medium text-gray-700"
          >
            Amount ($)
          </label>
          <input
            id="deal-value"
            type="number"
            name="value"
            className="mt-2 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="250.00"
            min="0.01"
            step="0.01"
            required
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPending || metrics.length === 0}
        >
          {isPending ? 'Adding...' : 'Add Deal'}
        </button>

        {errorMessage && (
          <p
            id="deal-error"
            role="alert"
            className="text-sm text-red-600 sm:col-span-3"
          >
            {errorMessage}
          </p>
        )}
      </form>
    </section>
  );
}

export default Form;
