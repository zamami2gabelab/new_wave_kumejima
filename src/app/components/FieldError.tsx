// フィールドエラー表示コンポーネント

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p className={`text-sm text-red-600 mt-1 ${className || ""}`}>{message}</p>
  );
}
