import { PublicNewsList } from '@/components/public/PublicNewsList';
import { PublicHeader } from '@/components/public/PublicHeader';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Poliq - Portal de Notícias
          </h1>
          <p className="text-xl text-gray-600">
            As melhores notícias processadas com inteligência artificial
          </p>
        </div>
        
        <PublicNewsList />
      </main>
    </div>
  );
}