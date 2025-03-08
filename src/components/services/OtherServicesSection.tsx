import Link from "next/link";
import { FaRegCheckCircle } from "react-icons/fa";
import { allServices } from "@/globalData";
interface OtherServicesSectionProps {
  servicesToExclude: number[];
  currentServicePage: string;
}

const OtherServicesSection = ({
  servicesToExclude,
  currentServicePage,
}: OtherServicesSectionProps) => {
  return (
    <section className="bg-blue-700 text-white text-sm">
      <div>
        <h2>
          Apart from {currentServicePage}, we also offer the following services:
        </h2>
        <div className="grid grid-cols-1 min-[642px]:grid-cols-2 min-[924px]:grid-cols-3 min-[1248px]:grid-cols-4 gap-1 max-h-[70vh] overflow-y-auto chat-scrollbars">
          {allServices.map((service) => (
            <Link
              key={service.id}
              href={service.LinkTo}
              className={` ${
                servicesToExclude.includes(service.id)
                  ? "hidden"
                  : "horizontal gap-3 w-fit hover:bg-white hover:text-blue-700 p-2 rounded-md transition-all duration-500"
              }`}
            >
              <FaRegCheckCircle size={15} className="flex-shrink-0" />{" "}
              <span> {service.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherServicesSection;
