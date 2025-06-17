
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
