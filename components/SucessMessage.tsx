import Link from "next/link";

interface SuccessMessageProps {
  title: string;
  message: string;
  description?: string;
  linkHref?: string;
  linkText?: string;
}

export function SuccessMessage({
  title,
  message,
  description,
  linkHref = "/",
  linkText = "トップページに戻る",
}: SuccessMessageProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-w-64 max-w-64 mx-auto gap-6 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">{title}</h1>
        <div className="bg-green-50 text-green-800 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p>{message}</p>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {linkHref && (
        <Link className="text-primary underline" href={linkHref}>
          {linkText}
        </Link>
      )}
    </div>
  );
}
