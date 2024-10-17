// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Accounting Package",
//   description: "This is a simple accounting package",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }

import Providers from "@/lib/providers";
// import "@/utils/extentions";
// import "@/app/app.css"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
