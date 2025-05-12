import HeroSectionImage1 from "@/assests/HeroSectionImage1.png"; // Adjust the path as necessary
import NotificationCarousel from "@/components/common/NotificationCarousel";
import DashboardItems from "@/components/customer/DashboardItems";

const notifications = [
  {
    testimony: "Carol has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "CK3 has just withdrawn KES2300",
    source: "Withdrawals",
  },
  {
    testimony: "Mike has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Betty has just earned KES500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Clinton Otieno has just earned KES6720 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Josh Mwangi has just earned KES8900 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Wambui Ann has just earned KES1200from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Musyoka has just earned KES6210 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Winne has just earned KES78030 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Carol has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Marie has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Njuguna has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Carol has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "ChrisPaul has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Carol has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Carol has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Carol has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Carol has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Peter Nekesa has just earned KES4500 from Whatsapp",
    source: "Whatsapp",
  },
  {
    testimony: "Wainani has just earned KES4500 from Whatsapp",
    source: "Withdrawals",
  },
];

const UserDashBaord = () => {
  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: `url(${HeroSectionImage1.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <section className="min-h-[40vh]">
        <NotificationCarousel notifications={notifications} />
      </section>
      <section className="!py-0 !px-0 !mx-0">
        <DashboardItems />
      </section>
    </div>
  );
};

export default UserDashBaord;
