import React from "react";
import Image from "next/image";
import LeadLogo from "../../public/assets/lead.png";
import LeadGenerationForm from "./LeadGenerationForm";

const LeadGeneration = () => {
  return (
    <div className="container mx-auto">
      <div className="px-5 md:px-10 lg:px-20 2xl:px-8 my-[50px]">
        <div className="flex flex-col items-center text-center">
          {/* Logo Section */}
          <div className="mb-6">
            <Image src={LeadLogo} alt="Summit Logo" width={350} height={150} />
          </div>

          {/* Title Section */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A3C5A] uppercase mb-2">
            Sommet d'Affaires Malaisie–Guinée 2025
          </h1>
          <h2 className="text-xl md:text-[28px] text-[#1A3C5A] font-bold">
            Conakry, République de Guinée
            <br />
          </h2>
          <p className="italic font-bold">
            {" "}
            Organisé en collaboration avec KingMansa
          </p>
          {/* Flags Section */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center ">
              <Image
                src={`https://flagcdn.com/my.svg`}
                alt="Malaysia Flag"
                width={50}
                height={50}
                className="mr-2 h-[20px] w-auto"
              />
              <span className="text-3xl">🤝</span>
              <Image
                src={`https://flagcdn.com/gn.svg`}
                alt="Guinea Flag"
                width={50}
                height={50}
                className="mr-2 h-[20px] w-auto"
              />
            </div>
          </div>

          {/* Description Section */}
          <p className="text-sm md:text-[18px] font-semibold max-w-[80%] mb-8">
            Bienvenue sur le portail officiel de mise en relation du Sommet
            d'Affaires Malaisie–Guinée, le 27 mai 2025. Cette plateforme est
            développée par KingMansa, une solution B2B qui connecte les
            entreprises en Afrique et en Asie.
          </p>

          {/* Participation Section */}
        </div>
       
        {/* form  */}
        <LeadGenerationForm />
      </div>
    </div>
  );
};

export default LeadGeneration;
