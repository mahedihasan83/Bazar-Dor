export default function Section({
  id,
  title,
  subtitle,
  right,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-4 py-8 scroll-mt-4">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-base-content/60 mt-1">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
