/**
 * Library Updates Guinea-Pig App.
 *
 * This component has no real purpose other than importing and lightly
 * exercising every library in the platform's frontend ecosystem union, so
 * that `npm install && npm run build` genuinely fails if a candidate
 * version introduces a breaking import/type/bundling error.
 */
import { useState } from 'react';
import axios from 'axios';
import { Button, ConfigProvider } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Rocket } from 'lucide-react';
import { create } from 'zustand';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// axios — just reference the client shape, no real network call in the fixture.
void axios.create;

// zustand store
interface CounterState {
  count: number;
  increment: () => void;
}
const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));

// zod schema
const FormSchema = z.object({
  name: z.string().min(1),
});
type FormValues = z.infer<typeof FormSchema>;

const queryClient = new QueryClient();

function Ping() {
  const { data } = useQuery({
    queryKey: ['ping'],
    queryFn: async () => 'pong',
  });
  return <span>{data}</span>;
}

function App() {
  const [open, setOpen] = useState(false);
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);
  const { register, handleSubmit } = useForm<FormValues>();

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <div className={clsx('p-4', twMerge('bg-loft-bg', open && 'bg-loft-orange'))}>
          <Rocket size={16} />
          <Button icon={<SmileOutlined />} onClick={() => setOpen((v) => !v)}>
            Toggle ({count})
          </Button>
          <button onClick={increment}>+1</button>
          <form onSubmit={handleSubmit(() => {})}>
            <input {...register('name')} />
          </form>
          <Ping />
        </div>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
