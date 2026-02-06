interface ErrorBannerProps {
  error: string | null;
}

export const ErrorBanner = ({ error }: ErrorBannerProps) => {
  if (!error) {
    return null;
  }

  return <div className="error">{error}</div>;
}
