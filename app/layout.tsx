export const metadata = {
  title: 'Job Application Automation',
  description: 'AI-powered resume editor and job application tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}