import React from "react";
import { AiFillHeart } from "react-icons/ai";
import Image from "next/image";

interface Sibling {
  name: string;
  age: number;
}

interface BirthAnnouncementProps {
  babyName: string;
  birthDate: string;
  birthTime: string;
  weight: string;
  height: string;
  location: string;
  parentNames: string;
  siblings: Sibling[];
  photoUrl: string;
}

const BirthAnnouncement: React.FC<BirthAnnouncementProps> = ({
  babyName,
  birthDate,
  birthTime,
  weight,
  height,
  location,
  parentNames,
  siblings,
  photoUrl,
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-[500px] bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl shadow-xl">
        <div className="bg-white p-6 rounded-xl border-[3px] border-[#d4a5c3] text-center">
          <AiFillHeart className="text-[#d4a5c3] text-2xl mx-auto mb-5" />

          <p className="text-base text-gray-600 italic tracking-wide mb-5 font-serif">
            With joy and gratitude, we welcome...
          </p>

          <div className="w-full max-w-[350px] mx-auto mb-5 border-4 border-[#d4a5c3] rounded-lg overflow-hidden bg-gray-50 p-2.5">
            <div className="relative w-full aspect-[5/4]">
              <Image
                src={photoUrl}
                alt={`Baby ${babyName}`}
                fill
                className="object-cover rounded"
              />
            </div>
          </div>

          <h1 className="text-[42px] text-[#8b4f7d] my-5 font-serif italic font-normal">
            {babyName}
          </h1>

          <div className="w-[60px] h-[2px] bg-[#d4a5c3] mx-auto my-4" />

          <div className="text-sm text-gray-800 leading-relaxed my-4">
            <div>
              <span className="font-bold text-[#8b4f7d]">{birthDate}</span> at{" "}
              {birthTime}
            </div>
            <div className="mt-2">
              <span className="font-bold text-[#8b4f7d]">{weight}</span> •{" "}
              <span className="font-bold text-[#8b4f7d]">{height}</span>
            </div>
            <div className="mt-2">{location}</div>
          </div>

          <p className="text-base text-gray-600 italic mt-5 font-serif">
            {parentNames}
          </p>

          <div className="text-[13px] text-gray-700 mt-4 p-3 bg-pink-50 rounded-md border border-pink-200">
            Joyfully welcomed by big siblings:
            <br />
            {siblings.map((sibling, index) => (
              <React.Fragment key={index}>
                <strong>{sibling.name}</strong> (age {sibling.age})
                {index < siblings.length - 1 && " & "}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthAnnouncement;
