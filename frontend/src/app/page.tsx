import { PublicNewsList } from '@/components/public/PublicNewsList';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <PublicNewsList />
      </main>
      <PublicFooter />
    </div>
  );
}