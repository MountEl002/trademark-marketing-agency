import BirthAnnouncement from "@/components/BirthAnnouncement";
import React from "react";

const BabyPage = () => {
  return (
    <div>
      <BirthAnnouncement
        babyName="Dorothy Mae Henderson"
        birthDate="January 11, 2026"
        birthTime="3:28 PM"
        weight="7 pounds, 4 ounces"
        height="20.5 inches"
        location="Bozeman, Montana"
        parentNames="Robert and Helen Henderson"
        siblings={[
          { name: "William Billy Henderson", age: 5 },
          { name: "Margaret Henderson", age: 3 },
        ]}
        photoUrl="/images/baby-image.jpg"
      />
    </div>
  );
};

export default BabyPage;
