import { cn, initials } from '@/lib/utils'

export function Avatar({
  name,
  src,
  size = 'md',
  className,
}: {
  name: string | null | undefined
  src?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sz =
    size === 'xs'
      ? 'h-6 w-6 text-[10px]'
      : size === 'sm'
        ? 'h-8 w-8 text-xs'
        : size === 'lg'
          ? 'h-14 w-14 text-lg'
          : size === 'xl'
            ? 'h-20 w-20 text-2xl'
            : 'h-10 w-10 text-sm'
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-brand-purple/30 to-brand-purpleDeep/40 font-semibold text-white',
        sz,
        className,
      )}
      aria-label={name ?? 'User'}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? 'User'}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  )
}
