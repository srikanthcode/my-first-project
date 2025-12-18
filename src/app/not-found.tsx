import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-background-dark p-4 text-center">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark mb-4">
                Page Not Found
            </h2>
            <p className="text-text-secondary dark:text-text-secondary-dark mb-8 max-w-md">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link href="/">
                <Button>Go back home</Button>
            </Link>
        </div>
    );
}
