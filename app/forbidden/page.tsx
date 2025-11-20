"use server";


type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function Forbidden({ }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">403</h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">Forbidden</h2>

        <p className="text-gray-600 mb-6">
          You dont have permission to access this resource. This page is
          restricted to administrators only.
        </p>
      </div>
    </div>
  );
}
