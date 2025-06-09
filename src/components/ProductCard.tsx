'use client'

import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import ClickParticles from "./ClickParticles";

interface Product {
  name: string;
  image: string;
  description: string;
  // outras propriedades que seu produto tem
}

export default function ProductCard(props: { product: Product }) {
  const [showParticles, setShowParticles] = useState(false);

   const handleClick = () => {
    setShowParticles(true);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="relative bg-emerald-400 rounded-2xl shadow-md p-4 flex flex-col items-center w-50 h-70 mx-auto cursor-pointer"
    >
      <Image src={props.product.image} alt={props.product.name} width={130} height={130} />
      <h2 className="text-lg font-bold mt-4 text-center">{props.product.name}</h2>
      <p className="!text-xxs text-gray-600 text-center">
        {props.product.description}
      </p>
      <ClickParticles trigger={showParticles} onComplete={() => setShowParticles(false)} />
    </motion.div>
  );
}