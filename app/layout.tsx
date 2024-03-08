import { auth } from '@/auth';
import ProfileModal from '@/components/modals/profile-modal';
import ToastProviders from '@/components/providers/toast-provider';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter, Sofia_Sans } from 'next/font/google';
import '@uploadthing/react/styles.css';
import './globals.css';
import ActiveStatus from '@/components/active-status';
import { ModalProvider } from '@/components/providers/modal-provider';

const inter = Inter({ subsets: ['latin'] });

const sofia_init = Sofia_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sofia_sans',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={sofia_init.className}>
          <div className="">
            <ToastProviders>{children}</ToastProviders>
          </div>
          <Toaster />
          <ProfileModal />
          <ModalProvider />
          <ActiveStatus />
        </body>
      </SessionProvider>
    </html>
  );
}
