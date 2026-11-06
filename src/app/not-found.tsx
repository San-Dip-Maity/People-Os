import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-2xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-md text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#eaf7f9] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8] mx-auto flex items-center justify-center">
          <FileQuestion className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h2 className="heading-section text-[#071B2B] dark:text-[#f0f7f9]">
            Page Not Found
          </h2>
          <p className="text-supporting text-zinc-500 dark:text-zinc-400">
            The HR module or resource you requested does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="btn-primary"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
