import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-[var(--border-warm)]">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton className={`h-4 ${i === 0 ? 'w-24' : i === columns - 1 ? 'w-16' : 'w-32'}`} />
        </td>
      ))}
    </tr>
  );
}
