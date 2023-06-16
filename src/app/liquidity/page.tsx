"use client";
import { memo, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { BiDownArrow } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";

const Liquidity = () => {
  const [activeAdd, setActiveAdd] = useState(true);
  const [tokenInput, setTokenInput] = useState({
    tokenA: "",
    tokenB: "",
  });

  const toggleAdd = () => {
    setActiveAdd((prev) => !prev);
  };

  /** @dev Handling form changing event */
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const match = /^\d*\.?\d*$/.test(e.target.value);
    if (match) {
      setTokenInput((prev) => {
        if (!e.target.value) {
          return {
            tokenA: "",
            tokenB: "",
          };
        }
        return {
          ...prev,
          [e.target.name]: e.target.value && e.target.value,
        };
      });
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col justify-evenly w-[90%]">
      <header className="text-center flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-medium">Pool</h1>
        <p className="text-md text-slate-300 max-w-xl">
          Add liquidity to the pool by depositing an equal value of both tokens.
          This action enhances the liquidity and depth of the pool, resulting in
          efficient token swaps for others.
        </p>
      </header>

      <div className="flex justify-evenly items-center pt-16 pb-14">
        <p
          onClick={toggleAdd}
          className={`${!activeAdd && "underline"} cursor-pointer`}
        >
          My Positions
        </p>
        <p
          onClick={toggleAdd}
          className={`${activeAdd && "underline"} cursor-pointer`}
        >
          Add Liquidity
        </p>
      </div>

      {activeAdd ? (
        <div className="flex items-center gap-8">
          <form className="w-3/4 flex flex-col gap-5" onSubmit={onSubmit}>
            <h1>Deposit Amounts</h1>

            <div className="border bg-slate-200 bg-opacity-10 backdrop-blur-xl rounded-3xl flex gap-3 items-center justify-center h-24 px-4">
              <input
                type="text"
                placeholder="0"
                name="tokenA"
                onChange={onChange}
                value={tokenInput.tokenA}
                className="w-full h-12 px-4 bg-transparent outline-none text-4xl"
                required
                autoFocus
              />
              <div className="flex gap-1 justify-center items-center px-7 py-2 cursor-pointer border border-slate-100 rounded-2xl">
                <Image src="/ftm-logo.svg" alt="" width={27} height={27} />
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">FTM</p>
                  <BiDownArrow />
                </div>
              </div>
            </div>
            <div className="border bg-slate-200 bg-opacity-10 backdrop-blur-xl rounded-3xl flex gap-3 items-center justify-center h-24 px-4">
              <input
                type="text"
                placeholder="0"
                name="tokenB"
                onChange={onChange}
                value={tokenInput.tokenB}
                className="w-full h-12 px-4 bg-transparent outline-none text-4xl"
                required
                autoFocus
              />
              <div className="flex gap-1 justify-center items-center px-7 py-2 cursor-pointer border border-slate-100 rounded-2xl">
                <Image src="/ftm-logo.svg" alt="" width={27} height={27} />
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">RAJ</p>
                  <BiDownArrow />
                </div>
              </div>
            </div>

            <button type="submit" className="btn w-full mt-10">
              Add
            </button>
          </form>
          <div className="w-2/4 flex flex-col gap-5">
            <h1>Pool Status</h1>

            <div className="p-4 py-6 bg-slate-200 bg-opacity-10 backdrop-blur-xl rounded-xl flex items-center justify-between text-sm text-slate-300">
              <p>Current rate</p>
              <p>156.045 RAJ/FTM</p>
            </div>

            <div className="p-4 py-6 bg-slate-200 bg-opacity-10 backdrop-blur-xl rounded-xl flex items-center justify-between text-sm text-slate-300">
              <p>Reserve RAJ</p>
              <p>156.045</p>
            </div>

            <div className="p-4 py-6 bg-slate-200 bg-opacity-10 backdrop-blur-xl rounded-xl flex items-center justify-between text-sm text-slate-300">
              <p>Reserve FTM</p>
              <p>10</p>
            </div>

            <div className="p-4 py-6 bg-slate-200 bg-opacity-10 backdrop-blur-xl rounded-xl flex items-center justify-between text-lg font-medium">
              <p>200 RAJ</p>
              <FaPlus />
              <p>10 FTM</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="">
          <h1>My Positions</h1>
        </div>
      )}
    </div>
  );
};

export default memo(Liquidity);
