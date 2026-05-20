import React from 'react';
import MainLayout from "../layouts/MainLayout";
import TestimonialsComponent from "../components/home/Testimonials";
import TestimonialListing from "../components/testimonials/TestimonialListing";
import FeaturedTestimonial from "../components/testimonials/FeaturedTestimonial";

const Testimonials = () => {
  return (
    <MainLayout>
      <TestimonialsComponent />
      <TestimonialListing />
      <FeaturedTestimonial />
    </MainLayout>
  );
};

export default Testimonials;
