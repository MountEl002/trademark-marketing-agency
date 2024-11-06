"use client";
import Image, { StaticImageData } from "next/image";
import CLientOneImage from "@/assests/testimonies/clientOne.jpg";
import CLientTwoImage from "@/assests/testimonies/clientTwo.jpg";
import CLientThreeImage from "@/assests/testimonies/clientThree.jpg";
import CLientFourImage from "@/assests/testimonies/clientFour.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DateDifference from "./dateDifference";

interface ClientReview {
  id: number;
  clientImage: StaticImageData;
  orderDetails: string;
  statement: string;
  daysAgo: string;
  numOfStars: string;
}

const CustomerReviews = () => {
  const clientReviews: ClientReview[] = [
    {
      id: 0,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientImage: CLientOneImage,
      orderDetails: "CLIENT #719844 HISTORY - 12 PAGES",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 1,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientImage: CLientTwoImage,
      orderDetails: "CLIENT #719844 Business - 8 PAGES",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 2,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientImage: CLientThreeImage,
      orderDetails: "CLIENT #719844 Psychology - 4 PAGES",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientImage: CLientFourImage,
      orderDetails: "CLIENT #719844 Nursing - 7 PAGES",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <div>
        <div className="vertical">
          <h3 className="text-center">
            Essay writing service customer reviews
          </h3>
          <p className="text-center max-w-3xl">
            Looking for proof of our excellence? Our clients&apos; success
            stories say it all. Through tailored essay writing solutions and
            unwavering support, we&apos;ve earned our reputation for exceptional
            service.
          </p>
        </div>
        <Slider {...settings}>
          {clientReviews.map((item) => (
            <div key={item.id}>
              <div className="horizontal gap-6 px-10">
                <div className="horizontal h-[400px] w-[500px]">
                  <Image
                    src={item.clientImage}
                    alt="image of client"
                    className="object-cover rounded-2xl"
                  />
                </div>
                <div>
                  <DateDifference targetDateString={item.daysAgo} />
                  <p className="text-blue-600 mb-4">{item.orderDetails}</p>
                  <p className="text-3xl font-semibold">{item.statement}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default CustomerReviews;
