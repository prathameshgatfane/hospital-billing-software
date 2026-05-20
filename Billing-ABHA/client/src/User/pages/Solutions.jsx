import React from 'react';
import MainLayout from "../layouts/MainLayout";
import SolutionsHero from "../components/solutions/SolutionsHero";
import SolutionCards from "../components/solutions/SolutionCards";
import SolutionBenefits from "../components/solutions/SolutionBenefits";
import SeamlessImplementation from "../components/solutions/SeamlessImplementation";

const Solutions = () => {
  return (
    <MainLayout>
      <div className="bg-[#212121]">
        <SolutionsHero />
        <SolutionCards />
        <SolutionBenefits />
        <SeamlessImplementation />
      </div>
    </MainLayout>
  );
};

export default Solutions;
