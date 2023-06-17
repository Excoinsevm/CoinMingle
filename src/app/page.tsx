import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-[70%] lg:w-[50%] h-full">
      <div className="flex flex-col items-center justify-center gap-24">
        <div className="flex flex-col items-center justify-center gap-10">
          <h1 className="text-5xl font-normal text-slate-200 text-center">
            Experience the power of{" "}
            <span className="font-bold text-white">DeFi</span> with
            <span className="font-bold text-white"> Fantom.</span>
          </h1>
          <p className="text-xl font-medium text-slate-300 text-center">
            We've done it carefully and simply.
            <br /> Combined with the ingredients make for beautiful landings.
          </p>
        </div>

        <Link
          href={"/swap"}
          className="btn w-60 h-14 flex items-center justify-center"
        >
          Let's Swap
        </Link>
      </div>
    </div>
  );
}
