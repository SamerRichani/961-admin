export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0000] mx-auto"></div>
      <span className="ml-4 text-[#FF0000] text-lg font-semibold">Loading Flex...</span>
    </div>
  );
} 