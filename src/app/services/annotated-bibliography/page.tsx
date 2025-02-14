import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import React from "react";

const AnnotatedBibliography = () => {
  const serviceTitle =
    "Let our professional writers craft your annotated bibliography";
  const openningStatement =
    "Get a high-quality annotated bibliography written by our well-versed professional-writers for just $2.50/page.";
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle={serviceTitle}
        openningStatement={openningStatement}
        getServiceButtonText="Get annotated bibliography writing help"
      />
    </>
  );
};

export default AnnotatedBibliography;
