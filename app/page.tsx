import dynamic from 'next/dynamic';

const TreeContainer = dynamic(() => import('@/components/Tree/TreeContainer'), {
  loading: () => (
    <div className="pt-[70px] relative w-full h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading...</div>
    </div>
  ),
  ssr: true,
});

export default function HomePage() {
  return (
    <div className="pt-[70px]">
      <TreeContainer />
    </div>
  );
}
