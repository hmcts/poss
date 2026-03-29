export function Tooltip({
  content,
  children,
  position = 'top',
  className,
}: {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}) {
  return (
    <span className={`relative inline-flex group${className ? ` ${className}` : ''}`}>
      {children}
      <span
        role="tooltip"
        className={[
          'pointer-events-none absolute z-10 whitespace-normal w-56 rounded-lg',
          'bg-slate-700 border border-slate-600 text-slate-200 text-xs px-3 py-2',
          'invisible group-hover:visible opacity-0 group-hover:opacity-100',
          'transition-opacity duration-150',
          position === 'top'
            ? 'bottom-full left-1/2 -translate-x-1/2 mb-1.5'
            : 'top-full left-1/2 -translate-x-1/2 mt-1.5',
        ].join(' ')}
      >
        {content}
      </span>
    </span>
  );
}
