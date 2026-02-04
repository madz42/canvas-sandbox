import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import EditorWrapper from '@/components/editor/EditorWrapper';

export default async function EditorPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { id } = await params;

  const { data: template, error } = await supabase.from('templates').select('*').eq('id', id).single();

  if (error || !template) {
    notFound();
  }

  return <EditorWrapper template={template} />;
}
