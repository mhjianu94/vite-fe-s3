import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Welcome() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                    Welcome
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Your application is ready with Vite, React, React Router, ShadCN, Jotai, Zod, and AWS Cognito.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/login">
                        <Button size="lg">Sign In</Button>
                    </Link>
                    <Button variant="outline" size="lg">Learn More</Button>
                </div>
            </div>
        </div>
    )
}

