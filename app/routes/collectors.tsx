import CollectorManager from "~/components/CollectorManager.client";

export default function CollectorsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CollectorManager />
      </div>
    </div>
  );
}