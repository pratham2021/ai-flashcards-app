import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Flashcard Generator",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
          <body className={inter.className}>
            <main className="container">
              <div className="flex items-start justify-center min-h-screen">
                <div className="mt-20">{children}</div>
              </div>
            </main>
          </body>
    </html>
  );
}