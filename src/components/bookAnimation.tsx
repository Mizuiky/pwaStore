"use client"; // ESSENCIAL para usar hooks!

import Lottie from "lottie-react";
import bookAnimation from "@/animations/books.json";

export default function BookAnimation() {
  return (
    <div className="w-[200px] h-[200px]">
      <Lottie animationData={bookAnimation} loop={true} />
    </div>
  );
}