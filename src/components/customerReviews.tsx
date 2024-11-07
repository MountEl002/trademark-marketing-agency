"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DateDifference from "./dateDifference";
import { FaUser } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { IconType } from "react-icons";
interface ClientReview {
  id: number;
  clientIcon: IconType;
  clientDetails: string;
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
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 1,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 2,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-11-01",
      numOfStars: "10/10",
      clientIcon: FaUser,
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  return (
    <>
      <div>
        <div className="vertical">
          <h3 className="text-center">
            Essay writing service customer reviews
          </h3>
          <p className="text-center max-w-3xl pb-10">
            Looking for proof of our excellence? Our clients&apos; success
            stories say it all. Through tailored essay writing solutions and
            unwavering support, we&apos;ve earned our reputation for exceptional
            service.
          </p>
        </div>
        <div className="bg-green-600">
          <Slider {...settings}>
            {clientReviews.map((item) => (
              <div key={item.id} className="ml-7">
                <div className="flex flex-col justify-between h-60 rounded-2xl border-2 border-gray-300 p-4 mx-4">
                  <div className="flex justify-between">
                    <div className="horizontal gap-1">
                      <FaStar size={20} className="text-yellow-500" />
                      {item.numOfStars}
                    </div>
                    <div>
                      {" "}
                      <DateDifference targetDateString={item.daysAgo} />
                    </div>
                  </div>
                  <div className="text-blue-600">{item.clientDetails}</div>
                  <div className="">{item.statement}</div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default CustomerReviews;
