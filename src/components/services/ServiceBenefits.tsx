import Image from "next/image";
import OrderAnEssay from "../common/order/OrderAnEssay";
import { ServiceRepImage, BenefitItem } from "@/types/servicesPages";

interface ServiceBenefitsProps {
  benefitsSectionTitle: string;
  benefitsDescription: string;
  serviceRepImage: ServiceRepImage;
  benefitItems: BenefitItem[];
}

const ServiceBenefits = ({
  benefitsSectionTitle,
  benefitsDescription,
  serviceRepImage,
  benefitItems,
}: ServiceBenefitsProps) => {
  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl text-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-10 my-8">
          <div className="text-start">
            <h2 className="w-full">{benefitsSectionTitle}</h2>
            <p>{benefitsDescription}</p>
          </div>
          <div className="mx-auto w-full">
            <Image
              src={serviceRepImage.src}
              alt={serviceRepImage.alt}
              className="rounded-2xl"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-8 p-4">
          {benefitItems.map((item) => (
            <div
              key={item.id}
              className="border-b-2 border-gray-400 text-justify"
            >
              <div className="flex flex-row justify-center min-[900px]:justify-start items-center gap-4 mb-4">
                <item.repIcon size={30} />
                <h4 className="!mb-0">{item.name}</h4>
              </div>
              <p>{item.description}</p>
              <br />
            </div>
          ))}
        </div>
        <div className="horizontal w-full mt-12">
          <OrderAnEssay />
        </div>
      </div>
    </section>
  );
};

export default ServiceBenefits;
