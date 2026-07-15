import { Link } from "react-router";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center max-w-md">
                <AlertTriangle className="w-20 h-20 text-custom-orange mx-auto mb-6" />
                <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
                </p>
                <Link 
                    to="/" 
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-custom-blue text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
