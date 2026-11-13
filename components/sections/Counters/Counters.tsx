import { StatsSection } from './StatsSection';
import type { HomeCopy } from '@/lib/i18n/pageCopy';

export function Counters({ copy }: { copy: HomeCopy }) {
  return <StatsSection copy={copy} />;
}
