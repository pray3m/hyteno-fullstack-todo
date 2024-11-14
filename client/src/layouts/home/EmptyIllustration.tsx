// src/components/EmptyIllustration.tsx

export default function EmptyIllustration() {
  return (
    <div className="flex flex-col items-center text-center text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {/* Example SVG Illustration */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7a4 4 0 014-4h10a4 4 0 014 4v12a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7l9 5 9-5"
        />
      </svg>
      <p className="text-lg">No todos available.</p>
    </div>
  );
}
