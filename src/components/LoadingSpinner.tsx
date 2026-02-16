export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">
        Generating your content...
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500">
        This may take 10-30 seconds
      </p>
    </div>
  );
}
