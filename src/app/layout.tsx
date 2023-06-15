import { Poppins } from "next/font/google";
import { MAIN_METADATA } from "@contents/metadata";
import WalletProvider from "@components/client/WalletProvider";
import NavBar from "@components/client/NavBar";
import "react-toastify/dist/ReactToastify.css";
import "@scss/globals.scss";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["devanagari"],
});

export const metadata = MAIN_METADATA;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${font.className} w-[90%] flex flex-col justify-evenly max-w-screen-2xl min-h-screen m-auto`}
      >
        <WalletProvider>
          <NavBar />
          <main className="bg-white h-[85vh] bg-opacity-20 backdrop-blur-3xl rounded-2xl flex justify-center items-center">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
