'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';

type HelperType = Database['public']['Enums']['channel_type'];

export async function createTemplate(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get('name') as string;
  const channel = formData.get('channel') as HelperType;

  if (!name || !channel) {
    throw new Error('Missing fields');
  }

  const { data, error } = await supabase
    .from('templates')
    .insert({
      name,
      channel,
      status: 'draft',
      canvas_data: {},
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating template:', error);
    throw new Error('Failed to create template');
  }

  redirect(`/templates/${data.id}`);
}
