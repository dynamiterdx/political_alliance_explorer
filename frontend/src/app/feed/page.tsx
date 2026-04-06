import { fetchWorldStateWithRelations } from '@/lib/db';
import FeedClient from '@/components/FeedClient';

export const revalidate = 10; // Revalidate every 10 seconds

export default async function FeedPage() {
  const currentYear = new Date().getFullYear();

  // Use pure generic pg access instead of Prisma Client mapping issues
  const worldState = await fetchWorldStateWithRelations(currentYear);

  return <FeedClient initialWorldState={worldState} />;
}
