export default function EmptyIllustration() {
  return (
    <div className="flex flex-col items-center text-center text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-32 w-32 mb-4"
        viewBox="0 0 512 512"
        fill="none"
      >
        <path
          d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z"
          fill="#E6F4FF"
        />
        <path
          d="M184 208h-48a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h48m80-96h48a16 16 0 0 1 16 16v64a16 16 0 0 1-16 16h-48"
          stroke="#007BFF"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M328 184a24 24 0 0 0-24-24h-96a24 24 0 0 0-24 24v144a24 24 0 0 0 24 24h96a24 24 0 0 0 24-24V184z"
          fill="#FFFFFF"
          stroke="#007BFF"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M184 336h144m-88-80h32m-32 40h32"
          stroke="#007BFF"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
