import { fetchWorldStateWithRelations } from '@/lib/db';
import DashboardClient from '@/components/DashboardClient';

export const revalidate = 10; // Revalidate every 10 seconds

export default async function Home() {
  const currentYear = new Date().getFullYear();

  // Use pure generic pg access instead of Prisma Client mapping issues
  const worldState = await fetchWorldStateWithRelations(currentYear);

  return <DashboardClient initialWorldState={worldState} />;
}
