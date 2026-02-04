import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function DesignsPage() {
  const supabase = await createClient();
  const { data: designs } = await supabase
    .from('designs')
    .select('*, templates(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Designs</h1>
        <div className="flex gap-4">
          <Link href="/templates" className="btn btn-outline">
            Back to Templates
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs?.map((design) => (
          <Link
            key={design.id}
            href={`/designs/${design.id}`}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border border-base-200"
          >
            <div className="card-body">
              <h2 className="card-title">{design.name}</h2>
              <p className="text-sm text-gray-500">Created: {new Date(design.created_at!).toLocaleDateString()}</p>
              {design.templates && (
                <p className="text-xs text-gray-400">
                  Based on: {Array.isArray(design.templates) ? design.templates[0]?.name : design.templates?.name}
                </p>
              )}
            </div>
          </Link>
        ))}

        {designs?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No designs found. Go to Templates to create one!
          </div>
        )}
      </div>
    </div>
  );
}
