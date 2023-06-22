"use client";
import { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Links } from "@contents/links";
import { Web3Button } from "@web3modal/react";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";

const NavBar = () => {
  const [isNavActive, setNavActive] = useState(false);
  const currentPage = usePathname();
  const { isConnected } = useAccount();

  return (
    <nav className="py-4 flex flex-row items-center justify-between">
      <div className="flex items-center gap-10">
        <Link href={"/"} className="font-semibold text-white">
          CoinMingle
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-slate-400 font-medium">
          {Links.map((link) => (
            <li
              key={link.name}
              className={`text-sm transition-all duration-500 hover:underline underline-offset-3 hover:text-white ${
                currentPage === link.path ? "text-white underline" : ""
              }`}
            >
              <Link onClick={() => setNavActive(false)} href={link.path}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {isNavActive && (
          <div className="fixed inset-0 z-50 md:hidden font-medium w-full h-full bg-black bg-opacity-80">
            <div className="flex flex-col items-center w-full h-full">
              <div className="w-full px-10 mt-10 flex items-center justify-between">
                <div className=""></div>
                <RxCross2
                  className="text-3xl cursor-pointer"
                  onClick={() => setNavActive(false)}
                />
              </div>
              <ul className="w-full h-full flex flex-col text-slate-500 gap-16 text-2xl justify-center items-center">
                {Links.map((link) => (
                  <li
                    key={link.name}
                    className={`transition-all duration-500 hover:underline underline-offset-3 hover:text-white ${
                      currentPage === link.path ? "text-white underline" : ""
                    }`}
                  >
                    <Link onClick={() => setNavActive(false)} href={link.path}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-5 justify-center items-center">
        {!isConnected && (
          <Image src={"/ftm-logo.svg"} alt="FTM" width={25} height={25} />
        )}
        <Web3Button balance="show" avatar="hide" icon="hide" label="Connect" />
        <HiOutlineMenuAlt3
          className="text-3xl cursor-pointer md:hidden"
          onClick={() => setNavActive(true)}
        />
      </div>
    </nav>
  );
};

export default memo(NavBar);
