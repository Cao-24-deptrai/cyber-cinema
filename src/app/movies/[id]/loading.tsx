export default function Loading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="h-[50vh] w-full bg-surface-border relative">
         <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <div className="container mx-auto px-4 -mt-32 relative z-10 flex flex-col md:flex-row gap-8">
        <div className="w-64 h-96 bg-surface-border rounded-lg shadow-2xl shrink-0" />
        <div className="flex-1 mt-8 md:mt-32 space-y-4">
          <div className="h-10 bg-surface-border rounded w-1/2"></div>
          <div className="h-6 bg-surface-border rounded w-1/3"></div>
          <div className="h-24 bg-surface-border rounded w-full mt-8"></div>
        </div>
      </div>
    </div>
  );
}
