import { TemplateStatusType, TemplateChannelType } from './types';

export const TEMPLATE_CHANNELS = [
  'facebook',
  'instagram',
  'linkedin',
  'display',
] as const satisfies readonly TemplateChannelType[];

export const TEMPLATE_STATUS = ['draft', 'active', 'archived'] as const satisfies readonly TemplateStatusType[];
