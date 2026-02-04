'use server';

import { Layer } from '@/components/editor/types';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateTemplate(id: string, canvasData: { layers: Layer[] }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('templates')
    .update({
      canvas_data: canvasData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw new Error('Failed to update template');
  }

  revalidatePath(`/templates`);
  revalidatePath(`/templates/${id}`);
}
