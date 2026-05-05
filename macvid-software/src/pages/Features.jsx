import React from 'react';
import MainLayout from "../layouts/MainLayout";
import FeaturesHero from "../components/features/FeaturesHero";
import AdvancedCapabilities from "../components/features/AdvancedCapabilities";
import SecurityFeatures from "../components/features/SecurityFeatures";
import FeaturesCTA from "../components/features/FeaturesCTA";

const Features = () => {
  return (
    <MainLayout>
      <div className="bg-[#212121]">
        <FeaturesHero />
        <AdvancedCapabilities />
        <SecurityFeatures />
        <FeaturesCTA />
      </div>
    </MainLayout>
  );
};

export default Features;
