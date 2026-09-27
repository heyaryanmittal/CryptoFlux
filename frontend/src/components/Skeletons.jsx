/**
 * Reusable Skeleton loader components for smooth, consistent loading state UI.
 */
export const SkeletonCard = () => (
    <div className="glass rounded-2xl p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2" />
            </div>
        </div>
        <div className="space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
        </div>
    </div>
);

export const SkeletonRow = () => (
    <div className="glass rounded-2xl px-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 animate-pulse flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-32" />
        </div>
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24" />
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-20" />
    </div>
);

export const SkeletonTable = ({ rows = 4 }) => (
    <div className="space-y-4">
        {[...Array(rows)].map((_, idx) => (
            <div key={idx} className="h-20 bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl w-full" />
        ))}
    </div>
);

export const SkeletonDetails = () => (
    <div className="container mx-auto px-6 pt-32 animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 dark:bg-white/10 rounded-xl w-32" />
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-white/10" />
                        <div className="space-y-2">
                            <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-48" />
                            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24" />
                        </div>
                    </div>
                </div>
                <div className="h-20 bg-gray-200 dark:bg-white/10 rounded-3xl w-full" />
                <div className="h-96 bg-gray-200 dark:bg-white/10 rounded-3xl w-full" />
            </div>
            <div className="space-y-6">
                <div className="h-80 bg-gray-200 dark:bg-white/10 rounded-3xl w-full" />
                <div className="h-64 bg-gray-200 dark:bg-white/10 rounded-3xl w-full" />
            </div>
        </div>
    </div>
);
