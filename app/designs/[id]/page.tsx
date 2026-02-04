import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import EditorWrapper from '@/components/editor/EditorWrapper';

export default async function DesignEditorPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { id } = await params;

  const { data: design, error } = await supabase.from('designs').select('*').eq('id', id).single();

  if (error || !design) {
    notFound();
  }

  const designForEditor = {
    ...design,
    channel: 'design',
  };

  return <EditorWrapper template={designForEditor} mode="design" />;
}
