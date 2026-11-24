import { useActionState } from 'react';
import type { MetricProps } from './Dashboard';

const Form = ({ metrics }: { metrics: MetricProps[] }) => {
  const [error, submitAction, isPending] = useActionState(
    async (prevState, formData) => {
      // Action logic
      const newDeal = {
        name: formData.get('name'),
        value: Number(formData.get('value')),
      };
      console.log('New deal:', newDeal);

      // Async operation

      // Return error state

      return null;
    },
    null, // Initial state
  );

  const generateOptions = () => {
    return metrics.map((metric) => (
      <option key={metric.name} value={metric.name}>
        {metric.name}
      </option>
    ));
  };

  return (
    <section className="mt-8 flex flex-col items-center justify-center gap-4 rounded bg-white p-4 shadow-md">
      <form action={submitAction} aria-label="Add new sales deal">
        <div className="sr-only">
          Use this form to add a new sales deal. Select a sales rep and enter
          the amount.
        </div>

        <label htmlFor="sales-rep" className="">
          Name:
          <select
            id="deal-name"
            name="name"
            defaultValue={metrics[0]?.name || ''}
            className="w-24 rounded border border-gray-300 px-2 py-1"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            disabled={isPending}
          >
            {generateOptions()}
          </select>{' '}
        </label>

        <label htmlFor="deal-value">
          Amount: $
          <input
            id="deal-value"
            type="number"
            name="value"
            defaultValue={0}
            className="w-24 rounded border border-gray-300 px-2 py-1"
            min="0"
            step="10"
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
            disabled={isPending}
          />
        </label>

        <button
          type="submit"
          className="ml-2 rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? 'Adding...' : 'Add Deal'}
        </button>
      </form>
    </section>
  );
};

export default Form;
