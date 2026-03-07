import { getActiveWorldState } from '@/lib/redis';
import DashboardClient from '@/components/DashboardClient';

export const revalidate = 10; // Revalidate every 10 seconds

export default async function Home() {
  const worldState = await getActiveWorldState();

  return <DashboardClient initialWorldState={worldState} />;
}
