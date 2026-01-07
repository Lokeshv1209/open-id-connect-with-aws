"use client";

import { redirect, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { menulist } from "@/common/constant";

const SideBarComponent = React.memo(function SideBar() {
  const [currentModule, setCurrentModule] = useState("");
  const pathName = usePathname();

  useEffect(() => {
    const moduleSection = pathName.split("/")[1];
    if (moduleSection) {
      setCurrentModule(moduleSection);
    }
  }, [pathName]);

  return (
    <div className="flex flex-col bg-[#FFFFFF] ">
      <div className=" flex flex-col  h-full ">
        <div className="  px-5 py-7.5 max-xl:p-1 rounded-4xl flex flex-col gap-3.5">
          {menulist.map((menu) => {
            return (
              <div
                key={menu.key}
                className={`bg-[#3350490D] flex items-center justify-start gap-2.5 py-2 px-3.5 rounded-md font-medium ${
                  currentModule == menu.key
                    ? "bg-gradient-to-b from-[#00B193] to-[#1EB54C] text-white"
                    : ""
                } w-[13rem]`}
                onClick={() => {
                  setCurrentModule(menu?.key);
                  redirect(menu?.path);
                }}
              >
                <div className="w-6 h-6">
                  <menu.image color={` ${currentModule == menu.key ? "#FFFFFF" : "#130F26"}`} />
                </div>
                <span className="text-sm font-medium">{menu?.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

SideBarComponent.displayName = "SideBar";

export { SideBarComponent as SideBar };
