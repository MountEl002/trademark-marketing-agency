interface ServiceDescriptionContainerProps {
  serviceDescriptionTitle: string;
  children: React.ReactNode;
}

const ServiceDescriptionContainer = ({
  serviceDescriptionTitle,
  children,
}: ServiceDescriptionContainerProps) => {
  return (
    <section className="bg-blue-100">
      <div className="grid grid-cols-1 gap-3 max-w-6xl mx-auto py-12">
        <h2 className="text-center">{serviceDescriptionTitle}</h2>
        <div className="services-and-processes relative h-[70vh] overflow-auto">
          {/* Fixed top position shadow */}
          <div className="sticky top-0 left-0 right-0 bg-gradient-to-b from-blue-100 to-transparent w-full h-[10%]"></div>
          {/* Body of the Descritpion */}
          <div className="grid grid-cols-1 sm:grid-cols-2">{children}</div>
          {/* Fixed bottom position shadow */}
          <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-blue-100 to-transparent w-full h-[10%]"></div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDescriptionContainer;
