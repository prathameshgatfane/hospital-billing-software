import React from 'react';
import MainLayout from "../layouts/MainLayout";
import PricingSection from "../components/pricing/PricingSection";
import PricingFeatures from "../components/pricing/PricingFeatures";
import PricingFAQ from "../components/pricing/PricingFAQ";
import PricingCTA from "../components/pricing/PricingCTA";

const Pricing = () => {
  return (
    <MainLayout>
      <div className="bg-[#212121]">
        <PricingSection />
        <PricingFeatures />
        <PricingFAQ />
        <PricingCTA />
      </div>
    </MainLayout>
  );
};

export default Pricing;
