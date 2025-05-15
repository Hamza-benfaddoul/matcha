import { FaStar, FaRegStar } from "react-icons/fa";

interface FameStarsProps {
    fameRating: number;
}

export function FameStars({ fameRating }: FameStarsProps) {
  const fameRatingToStars = (fameRating: number) => {
    if (fameRating >= 100) return 5;
    if (fameRating >= 80) return 4;
    if (fameRating >= 60) return 3;
    if (fameRating >= 40) return 2;
    if (fameRating >= 20) return 1;
    return 0;
  };

  const stars = fameRatingToStars(fameRating);

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        index < stars ? (
          <FaStar
            key={index}
            className="text-yellow-400 w-5 h-5 transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <FaRegStar
            key={index}
            className="text-gray-300 w-5 h-5 transition-transform duration-300 hover:scale-110"
          />
        )
      ))}
    </div>
  );
}
