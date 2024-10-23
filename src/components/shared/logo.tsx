import React from "react";
import Image from "next/image";

import logo from "@/src/assets/TravelQuesta.png";
export default function BrandLogo() {
  return (
    <div className="w-10">
      <Image
        alt="brand-logo"
        className="w-10 h-10 rounded-full"
        height={500}
        src={logo}
        width={500}
      />
    </div>
  );
}
