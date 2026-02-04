'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function createDesignFromTemplate(templateId: string) {
  const supabase = await createClient();

  // 1. Fetch template
  const { data: template, error: fetchError } = await supabase
    .from('templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (fetchError || !template) {
    throw new Error('Template not found');
  }

  // 2. Create design
  const { data: design, error: insertError } = await supabase
    .from('designs')
    .insert({
      template_id: template.id,
      name: `${template.name} (Design)`,
      canvas_data: template.canvas_data,
    })
    .select('id')
    .single();

  if (insertError) {
    throw new Error('Failed to create design');
  }

  // 3. Redirect
  redirect(`/designs/${design.id}`);
}
