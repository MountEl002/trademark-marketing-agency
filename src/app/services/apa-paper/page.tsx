import ServiceHeroSection from "@/components/services/ServiceHeroSection";
import React from "react";

const APAPaper = () => {
  const serviceTitle = "Stress-free APA mastery: your ultimate paper solution";
  const openningStatement =
    "Only $2.50 per page for premium quality and customer-approved excellence. Transform your work with our proven expertise!";
  return (
    <>
      {/* Hero section */}
      <ServiceHeroSection
        serviceTitle={serviceTitle}
        openningStatement={openningStatement}
        getServiceButtonText="Get APA paper now"
      />
    </>
  );
};

export default APAPaper;
