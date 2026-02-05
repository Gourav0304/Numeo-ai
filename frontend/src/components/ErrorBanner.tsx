interface ErrorBannerProps {
  error: string | null;
}

export default function ErrorBanner({ error }: ErrorBannerProps) {
  if (!error) {
    return null;
  }

  return <div className="error">{error}</div>;
}
