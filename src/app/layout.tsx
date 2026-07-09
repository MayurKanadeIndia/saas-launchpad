import './globals.css';

export const metadata = {
  title: 'SaaS Launchpad',
  description: 'Dynamic feature flags orchestration framework.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 antialiased">
        {children}
      </body>
    </html>
  );
}
