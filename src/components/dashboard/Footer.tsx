"use client";
import React from "react";

const FooterComponent = React.memo(function Footer() {
  return (
    <div className="flex justify-between items-center max-md:flex-col max-md:p-0 px-[11.5rem] py-2.75 text-xs w-full">
      <div className="flex max-md:flex-col max-md:gap-0 gap-3 ">
        <p>Privacy Policy</p>
        <p>Terms of Use</p>
      </div>
      <p>© 2021 LSB, Soft Suave Technology.</p>
    </div>
  );
});

FooterComponent.displayName = "Footer";

export default FooterComponent;
