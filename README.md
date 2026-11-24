# Sales Team Dashboard

A small learning project that helps you see how much each employee has sold. Sales deals are stored in Supabase, and the dashboard adds them together to show one bar per employee.

For example, if Alex has two deals worth $100 and $200, Alex's bar shows $300.

## Why I'm building this project

I'm working on this project to learn how to use Supabase: connecting an app to a database, reading and inserting data, understanding permissions, and listening for changes.

At the same time, I'm practicing React and Tailwind CSS to reinforce my knowledge of components, state, effects, forms, and responsive styling. I'm keeping the code and design simple so I can understand each part as I build it.

## What is Supabase?

[Supabase](https://supabase.com/docs) is a backend platform built around PostgreSQL, a database that stores information in tables. It provides tools for working with data, managing user sign-in, storing files, and listening for live updates, so you don't have to build all of those features from scratch.

In this project, Supabase stores the sales deals, calculates employee totals, and sends notifications when the data changes so the dashboard can refresh the chart.

## What you can do

- Compare employees' sales totals in a bar chart.
- Hover over a bar to see its total in dollars.
- See how many employees appear in the results.
- Select an existing employee and add a new deal.
- Enter positive amounts, including cents.
- See an error message if a deal cannot be saved.
- Get updated totals when Supabase sends a database change notification.
- Use the dashboard on smaller screens, with the form fields stacked vertically.

The green header stays at the top of the page. The chart and form use simple Tailwind classes for spacing, colors, borders, and rounded corners.

## How it works

1. When the dashboard opens, it requests sales data from Supabase.
2. The database groups deals by employee name and adds their values together.
3. React stores the results in the `metrics` state.
4. Recharts uses each employee's `name` as a label and their `sum` as the bar's height.
5. When you submit the form, it checks the employee and amount, then inserts a new row into `sales_deals`.
6. With Realtime configured, a database change triggers another request for the totals, updating the chart.

The form currently uses React's `useActionState`. It manages the returned error message and the pending state. While saving, the controls are disabled and the button says "Adding...". The dashboard removes its Realtime subscription when it leaves the page.

## Built with

| Tool         | What it does here                                      |
| ------------ | ------------------------------------------------------ |
| React        | Builds the page and updates it when the data changes.  |
| TypeScript   | Checks the shapes of values used in the code.          |
| Tailwind CSS | Styles the header, cards, form, and responsive layout. |
| Supabase     | Stores deals and sends database change notifications.  |
| Recharts     | Draws the bar chart.                                   |
| Vite         | Runs the local development server and builds the app.  |

## Run the project locally

You need Node.js 22.12 or newer, npm, and a Supabase project configured as described below.

Install the dependencies from the project folder:

```bash
npm install
```

Create a file named `.env.local` in the project folder and add your Supabase connection details:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-publishable-key
```

Use your project's browser-safe publishable key, not a secret or `service_role` key. Vite exposes `VITE_` values to the browser. This repository ignores `.env.local` through its `*.local` rule. See [Vite's environment variable guide](https://vite.dev/guide/env-and-mode).

Start the app:

```bash
npm run dev
```

Open the local address printed in the terminal, usually `http://localhost:5173`. Restart the development server after changing the environment file.

## Supabase setup

The app expects a table named `public.sales_deals` with these columns:

| Column  | Expected value               |
| ------- | ---------------------------- |
| `name`  | The employee's name as text. |
| `value` | The deal amount as a number. |

Add at least one starting deal for each employee through the Supabase Table Editor. The form gets its employee list from existing deals, so an empty table leaves the select and submit button disabled.

Enable aggregate requests by running this in the Supabase SQL Editor:

```sql
ALTER ROLE authenticator SET pgrst.db_aggregates_enabled = 'true';
NOTIFY pgrst, 'reload config';
```

The app has no sign-in screen, so requests use the `anon` role. Configure `SELECT` and `INSERT` grants, enable Row Level Security (RLS), and add matching policies for reading and inserting rows. Grants allow an operation on the table; policies decide which rows it can affect. Allow public reading and inserting only if this is intended to be a public practice database. See [Supabase's permissions guide](https://supabase.com/docs/guides/api/securing-your-api).

For automatic updates, enable `sales_deals` in the `supabase_realtime` publication in your project's Publications settings. See [Supabase's Postgres Changes setup](https://supabase.com/docs/guides/realtime/postgres-changes).

## Main files

| File                                          | Responsibility                                                   |
| --------------------------------------------- | ---------------------------------------------------------------- |
| [App.tsx](src/App.tsx)                        | Places the header and dashboard on the page.                     |
| [Header.tsx](src/components/Header.tsx)       | Displays the fixed green header.                                 |
| [Dashboard.tsx](src/components/Dashboard.tsx) | Fetches totals, listens for changes, and renders the chart.      |
| [Form.tsx](src/components/Form.tsx)           | Validates and saves new deals, and displays save errors.         |
| [supabase.ts](src/utils/supabase.ts)          | Creates the Supabase connection using the environment variables. |
| [index.css](src/index.css)                    | Imports Tailwind CSS.                                            |

## Useful commands

| Command           | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Start the development server.                               |
| `npm run build`   | Check TypeScript and create the production files in `dist`. |
| `npm run preview` | Preview the production build locally after building.        |
| `npm run lint`    | Check the code with ESLint.                                 |

## Things to know

- The chart title says "Total Sales This Quarter", but the current query totals **all deals in the table**. A date filter is needed to limit the results to a quarter.
- Employees are grouped by name. Two people with the same name would share one total.
- The form adds deals for existing employees; it does not create new employees.
- A "permission denied" error means the database grants or RLS policies need checking. Reading and inserting require separate permissions.
- If saving works but the chart does not update automatically, check the Realtime setup. Refreshing the page fetches the latest totals again.
- Fetch errors are logged in the browser console. Save errors also appear below the form.
