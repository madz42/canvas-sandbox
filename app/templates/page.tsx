import { createClient } from '@/utils/supabase/server';
import { CreateTemplateModalButton } from './CreateTemplateModalButton';
import Link from 'next/link';

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data: templates } = await supabase.from('templates').select('*').order('updated_at', { ascending: false });

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Templates</h1>
        <div className="flex gap-4">
          <Link href="/designs" className="btn btn-outline">
            View Designs
          </Link>
          <CreateTemplateModalButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template) => (
          <Link
            key={template.id}
            href={`/templates/${template.id}`}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border border-base-200"
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h2 className="card-title">{template.name}</h2>
                <div className="badge badge-outline capitalize">{template.channel}</div>
              </div>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(template.updated_at!).toLocaleDateString()}
              </p>
              <div className="card-actions justify-end mt-4">
                <div
                  className={`badge ${
                    template.status === 'active'
                      ? 'badge-success'
                      : template.status === 'archived'
                        ? 'badge-ghost'
                        : 'badge-warning'
                  }`}
                >
                  {template.status}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {templates?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No templates found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
