"use client"

import SimpleLineChart from '@/components/chart'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <QueryClientProvider client={queryClient}>
        <SimpleLineChart />
      </QueryClientProvider>
    </main>
  )
}
