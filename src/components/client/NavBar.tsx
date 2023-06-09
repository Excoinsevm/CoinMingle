"use client";
import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Links } from "@contents/links";
import { Web3Button } from "@web3modal/react";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";

const NavBar = () => {
  const currentPage = usePathname();
  const { isConnected } = useAccount();

  return (
    <nav className="py-4 flex flex-row items-center justify-between">
      <div className="flex items-center gap-10">
        <Link href={"/"} className="font-semibold text-white text-2xl">
          CoinMingle
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-slate-400 font-medium">
          {Links.map((link) => (
            <li
              key={link.name}
              className={`transition-all duration-500 hover:underline underline-offset-3 hover:text-white ${
                currentPage === link.path ? "text-white underline" : ""
              }`}
            >
              <Link href={link.path}>{link.name}</Link>
            </li>
          ))}
        </ul>

        <ul className="absolute z-50 left-0 bottom-5 self-center flex md:hidden items-center justify-around gap-6 text-slate-400 font-medium w-full rounded-3xl h-[7vh] bg-white bg-opacity-40">
          {Links.map((link) => (
            <li
              key={link.name}
              className={`transition-all duration-500 hover:underline underline-offset-3 hover:text-black ${
                currentPage === link.path ? "text-black underline" : ""
              }`}
            >
              <Link href={link.path}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-5 justify-center items-center">
        {!isConnected && (
          <Image src={"/ftm-logo.svg"} alt="FTM" width={40} height={40} />
        )}
        <Web3Button balance="show" avatar="hide" icon="hide" label="Connect" />
      </div>
    </nav>
  );
};

export default memo(NavBar);
