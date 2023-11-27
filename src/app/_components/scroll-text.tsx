"use client";

import { FaAngleDown } from "react-icons/fa";
import { useState } from "react";

export default function ScrollText() {
  const [isVisible, setIsVisible] = useState(true);

  // hide text on scroll down
  if (typeof window !== "undefined") {
    window.onscroll = () => {
      setIsVisible(window.scrollY < 100);
    };
  }

  return (
    <p
      id="scroll-text"
      className={`group fixed bottom-0 w-full pb-4 text-center text-sm text-base-content/50 transition-all duration-200 ease-in-out hover:cursor-default hover:text-base-content ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      Scroll down for more info{" "}
      <FaAngleDown className={`inline group-hover:animate-bounce`} />
    </p>
  );
}
