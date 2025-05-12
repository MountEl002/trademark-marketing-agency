import React from "react";
import Image from "next/image";
import { DashboardItemTemplate } from "@/types/trademark";

interface DashboardsTemplateProps {
  items: DashboardItemTemplate[];
}

const DashboardsTemplate = ({ items }: DashboardsTemplateProps) => {
  return (
    <div className="grid grid-cols-1 gap-10 max-w-2xl mx-auto py-12">
      {items.map((item, index) => (
        <div
          key={index}
          className="border-2 bg-green-400  border-indigo-400 horizontal-space-between py-2 px-6 rounded-xl shadow-md"
        >
          <div className="verical-start gap-10 text-white font-bold">
            <p className="mb-3">{item.title}</p>
            {(item.amount ?? -1) >= 0 ? (
              <p className="text-2xl">{`KSh. ${item.amount?.toFixed(2)}`}</p>
            ) : (
              <p className="text-2xl">{item.packages}</p>
            )}
          </div>
          <div className="veritical p-1 rounded-[50%] bg-white shadow-md">
            <Image
              src={item.repImage}
              alt={item.repImageAlt}
              className="w-16 h-16"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardsTemplate;
