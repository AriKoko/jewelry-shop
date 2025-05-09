import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-custom py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">העמוד לא נמצא</h1>
          <p className="text-lg text-gray-600 mb-8">
            אנחנו מצטערים, אך העמוד שחיפשת אינו קיים או שהוסר.
          </p>

          <div className="mt-8">
            <Link 
              href="/" 
              className="btn-primary inline-block"
            >
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 