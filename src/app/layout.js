import { ReduxProvider } from '@/redux/provider';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'MyStore - Next.js E-commerce',
  description: 'Complete e-commerce platform with authentication and product management',
  keywords: 'next.js, ecommerce, react, redux, mongodb',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <ReduxProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}