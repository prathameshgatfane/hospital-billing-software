import React from 'react';
import MainLayout from "../layouts/MainLayout";
import ContactHero from "../components/contact/ContactHero";
import ContactForm from "../components/contact/ContactForm";
import ContactFAQCTA from "../components/contact/ContactFAQCTA";

const Contact = () => {
  return (
    <MainLayout>
      <ContactHero />
      <ContactForm />
      <ContactFAQCTA />
    </MainLayout>
  );
};

export default Contact;
