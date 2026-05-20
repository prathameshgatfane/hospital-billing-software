import React from 'react';
import MainLayout from "../layouts/MainLayout";
import ResourcesHero from "../components/resources/ResourcesHero";
import ResourcesGrid from "../components/resources/ResourcesGrid";
import UpcomingWebinars from "../components/resources/UpcomingWebinars";
import PricingFAQ from "../components/pricing/PricingFAQ";
import ResourcesCTA from "../components/resources/ResourcesCTA";

const Resources = () => {
  return (
    <MainLayout>
      <ResourcesHero />
      <ResourcesGrid />
      <UpcomingWebinars />
      <PricingFAQ />
      <ResourcesCTA />
    </MainLayout>
  );
};

export default Resources;
