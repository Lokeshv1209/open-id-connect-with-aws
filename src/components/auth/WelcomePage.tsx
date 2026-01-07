"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import WelcomeIcon from "@/../public/WelcomeIcon.svg";

import { Button } from "../ui/button";

function WelcomePage() {
  const router = useRouter();

  return (
    <div className="p-6 flex justify-center  items-center bg-cover bg-center h-screen">
      <div className="w-md z-10 text-center">
        <div className="flex justify-center">
          <Image
            src={WelcomeIcon}
            alt=""
            className="w-[120px] h-[120px] bg-[#FFFFFFCC] p-5 rounded-full"
          />
        </div>
        <div className="text-white flex flex-col justify-center items-center">
          <h1 className="text-md font-semibold py-2 ">
            You&apos;re Verified as Organization Admin!
          </h1>
        </div>
        <div className="border bg-white rounded-4xl my-5 p-5">
          <div className="pt-3 ">
            <h1 className="text-center pb-1 text-[#005B44] font-bold text-lg">Welcome</h1>
            <div className="w-18 mx-auto bg-[#FED521]  rounded-2xl h-[4px] "></div>
            <div className="text-sm font-normal py-2 flex flex-col gap-3">
              <p className="">
                You are now officially the Admin of{" "}
                <span className="font-semibold">TechCorp Solutions</span> on LFB.
              </p>
              <p>
                Start building a better workplace culture by creating surveys, engaging with posts,
                and managing your team effectively.
              </p>
            </div>
            <div className="flex justify-center py-2">
              <Button
                onClick={() => router.replace("/questionnaires")}
                className=""
                variant="gradientGreen"
              >
                <div className="flex gap-2">
                  <span>Go to Dashboard</span>
                  <ArrowRight />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
