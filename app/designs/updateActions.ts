'use server';

import { Layer } from '@/components/editor/types';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateDesign(id: string, canvasData: { layers: Layer[] }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('designs')
    .update({
      canvas_data: canvasData,
      // designs table doesn't have updated_at in my init script? Let me check.
      // Checking init_schema.sql... "created_at timestamptz default now()"... no updated_at.
      // So just update canvas_data is fine.
    })
    .eq('id', id);

  if (error) {
    throw new Error('Failed to update design');
  }

  revalidatePath(`/designs`);
  revalidatePath(`/designs/${id}`);
}
