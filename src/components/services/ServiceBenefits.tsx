import Image from "next/image";
import OrderAnEssay from "../common/order/OrderAnEssay";
import { ServiceRepImage, BenefitItem } from "@/types/servicesPages";
import { IoShieldCheckmark, IoSparklesSharp } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { IoIosUnlock } from "react-icons/io";
import { TbTargetArrow } from "react-icons/tb";
import { FaPhoneVolume } from "react-icons/fa";
import GetServiceButton from "./GetServiceButton";

interface ServiceBenefitsProps {
  benefitsSectionTitle: string;
  benefitsDescription: string;
  serviceRepImage: ServiceRepImage;
  serviceButtonText: string;
}

const benefitItems: BenefitItem[] = [
  {
    id: 1,
    repIcon: IoSparklesSharp,
    name: "Expert Academic Writers",
    description:
      "Our carefully vetted team of professional writers holds advanced degrees from leading universities. We match your assignment with the most qualified expert in your field to ensure exceptional quality.",
  },
  {
    id: 2,
    repIcon: MdAttachMoney,
    name: "Excellence at Affordable Rates",
    description:
      "Competitive pricing meets premium quality. Pay only after reviewing and approving your completed essay. Your satisfaction is our priority.",
  },
  {
    id: 3,
    repIcon: IoIosUnlock,
    name: "100% Confidentiality & Security",
    description:
      "Your privacy matters. All interactions with our service are strictly confidential, and your personal information remains completely secure.",
  },
  {
    id: 4,
    repIcon: IoShieldCheckmark,
    name: "Advanced Quality Assurance",
    description:
      "Every essay undergoes: Rigorous plagiarism checking, AI detection scanning, Professional editing, Quality control review. All quality checks are included free with your order.",
  },
  {
    id: 5,
    repIcon: TbTargetArrow,
    name: "Streamlined Ordering Process",
    description:
      "We've simplified excellence: Submit your requirements, Our team assigns the best-qualified expert, Receive your perfectly crafted essay, Review and approve, Release payment only when satisfied.",
  },
  {
    id: 6,
    repIcon: FaPhoneVolume,
    name: "24/7 Dedicated Support",
    description:
      "Our professional support team is available around the clock to assist you with any questions or concerns about your order.",
  },
];

const ServiceBenefits = ({
  benefitsSectionTitle,
  benefitsDescription,
  serviceRepImage,
  serviceButtonText,
}: ServiceBenefitsProps) => {
  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl text-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-10 my-8">
          <div className="text-start">
            <h2 className="w-full">{benefitsSectionTitle}</h2>
            <p className="mb-8">{benefitsDescription}</p>
            <div className="hidden md:block mt-8">
              <GetServiceButton text={serviceButtonText} />
            </div>
          </div>
          <div className="mx-auto w-full">
            <Image
              src={serviceRepImage.src}
              alt={serviceRepImage.alt}
              className="rounded-2xl"
            />
            <div className="hidden sm:block md:hidden mt-8">
              <GetServiceButton text={serviceButtonText} />
            </div>
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
