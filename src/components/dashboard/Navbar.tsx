"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import LFbLogo from "@/../public/LFBLogo.svg";
import SearchIcon from "@/../public/SearchIcon.svg";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { logout } from "@/lib/utils";
import { changeNavSearch } from "@/store/slice/GlobalSearchSlice";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function Navbar() {
  const dispatch = useAppDispatch();
  const { NavBarSearch } = useAppSelector((state) => state?.GlobalSearch);
  const { userInfo, orgInfo } = useAppSelector((state) => state?.userDetails);
  const [searchValue, setSearchValue] = useState(NavBarSearch);
  const pathName = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(changeNavSearch(searchValue));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, dispatch]);

  return (
    <div className="flex items-center max-md:flex-col-reverse max-md:items-start  gap-2 px-5 py-3 w-full border-b-4">
      <div className="flex gap-2 items-center w-[20rem] ">
        <Image src={LFbLogo} alt="m-logo" className="w-7 h-7" />
        <h1 className="text-3xl max-xl:text-md bg-gradient-to-b from-[#00B193]  to-[#1EB54C] bg-clip-text text-transparent font-bold">
          LFB
        </h1>
      </div>
      <div
        className={`flex ${pathName.split("/")[1] == "dashboard" ? "justify-center" : "justify-between"} max-md:justify-start  w-full `}
      >
        {pathName.split("/")[1] == "dashboard" ? (
          <div className="flex items-center justify-center h-[3rem]  border-[1px] border-[#0E0F111A]  font-[400] py-1 px-2  max-xl:py-1 text-[12px] max-xl:text-[11px] rounded-md">
            <Image className="w-5 h-5" src={SearchIcon} alt="" />
            <Input
              className="w-[17rem] text-sm  text-[#00110D99] bg-transparent outline-none border-none"
              placeholder="Search company or category..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e?.target?.value);
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 h-[3rem]">
            <div className="w-[3.3rem] h-[1.3rem] flex justify-center items-center relative">
              {orgInfo?.logoUrl ? (
                <Image
                  src={orgInfo?.logoUrl}
                  alt={`${orgInfo?.name} logo`}
                  fill
                  className="object-contain"
                />
              ) : (
                <p className="text-3xl">{orgInfo?.name?.charAt(0).toUpperCase()}</p>
              )}
            </div>
            <div>
              <h2 className="text-md font-medium text-[#064738]">{orgInfo?.name}</h2>
              <p className="text-sm font-normal text-[#606060]">{orgInfo?.domain}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-4 w-[17rem] justify-end max-md:justify-start items-center cursor-pointer">
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center gap-2 hover:cursor-pointer">
              <div className="rounded-full flex justify-center items-center bg-gray-200 max-xl:w-8 max-xl:h-8 w-[3rem] h-[3rem]">
                {/* <Image
            src={ProfileImg}
            className="rounded-full max-xl:w-10 max-xl:h-10 w-10 h-10"
            alt=""
          /> */}
                {userInfo?.name?.charAt(0).toUpperCase()}
              </div>
              <div className=" flex flex-col items-start">
                <h3 className="text-md font-normal">{userInfo?.name}</h3>
                <p className="text-[13px] text-[#8A92A6] font-normal">
                  {userInfo?.role == "super_admin" ? "Super Admin" : "Organization Admin"}
                </p>
              </div>
              <ChevronDown className="text-[#335049] w-4" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[10rem] mt-3" align="end">
            <div className="">
              <Button className="w-full" variant="gradientGreen" onClick={() => dispatch(logout())}>
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
