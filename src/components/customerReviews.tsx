import ReviewsDisplayer from "./common/reviewsDisplayer";
interface ClientReview {
  id: number;
  clientDetails: string;
  statement: string;
  daysAgo: string;
  numOfStars: string;
}

const CustomerReviews = () => {
  const clientReviews: ClientReview[] = [
    {
      id: 0,
      daysAgo: "2024-12-28",
      numOfStars: "9/10",
      clientDetails: "CLIENT #19844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed. Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 1,
      daysAgo: "2024-12-06",
      numOfStars: "10/10",
      clientDetails: "CLIENT #2438",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 2,
      daysAgo: "2024-12-04",
      numOfStars: "10/10",
      clientDetails: "CLIENT #719844",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 3,
      daysAgo: "2024-12-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #5674",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 4,
      daysAgo: "2024-12-05",
      numOfStars: "10/10",
      clientDetails: "CLIENT #39807",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 5,
      daysAgo: "2024-12-04",
      numOfStars: "10/10",
      clientDetails: "CLIENT #87645",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 6,
      daysAgo: "2024-12-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #210897",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 7,
      daysAgo: "2024-12-05",
      numOfStars: "10/10",
      clientDetails: "CLIENT #56729",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 8,
      daysAgo: "2024-11-03",
      numOfStars: "9/10",
      clientDetails: "CLIENT #67945",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 9,
      daysAgo: "2024-12-01",
      numOfStars: "10/10",
      clientDetails: "CLIENT #567453",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 10,
      daysAgo: "2024-12-05",
      numOfStars: "9/10",
      clientDetails: "CLIENT #67543",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 11,
      daysAgo: "2024-12-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #100547",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 12,
      daysAgo: "2024-12-05",
      numOfStars: "10/10",
      clientDetails: "CLIENT #29887",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 13,
      daysAgo: "2024-12-04",
      numOfStars: "9/10",
      clientDetails: "CLIENT #454647",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 14,
      daysAgo: "2024-12-02",
      numOfStars: "10/10",
      clientDetails: "CLIENT #77902",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 15,
      daysAgo: "2024-12-06",
      numOfStars: "10/10",
      clientDetails: "CLIENT #110089",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 16,
      daysAgo: "2024-12-01",
      numOfStars: "9/10",
      clientDetails: "CLIENT #562100",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 17,
      daysAgo: "2024-11-29",
      numOfStars: "10/10",
      clientDetails: "CLIENT #90889",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
    {
      id: 18,
      daysAgo: "2024-11-30",
      numOfStars: "9/10",
      clientDetails: "CLIENT #40982",
      statement:
        "Really Quick job! My order was an essay for college. I got a high mark, so I'm very happy! +1 point from me for speed.",
    },
  ];

  return (
    <>
      <div className="vertical">
        <h3 className="text-center">What our Clients Say About Us</h3>
        <p className="text-center max-w-3xl pb-10">
          Join 23K+ successful students who trust HighQualityEssay for their
          academic needs. With 392 qualified writers, We build lasting
          partnerships with our clients through exceptional service and
          affordable rates, making academic excellence accessible to all.
        </p>
      </div>
      <ReviewsDisplayer customerReviewsArray={clientReviews} />
    </>
  );
};

export default CustomerReviews;
