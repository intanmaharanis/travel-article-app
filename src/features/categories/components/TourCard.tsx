import { ArrowRight } from 'lucide-react';

interface TourCardProps {
  imageUrl: string;
  toursCount: number;
  title: string;
  description: string;
  categoryName: string;
  categoryIcon?: React.ReactNode;
}

const TourCard: React.FC<TourCardProps> = ({
  imageUrl,
  toursCount,
  title,
  description,
  categoryName,
  categoryIcon,
}) => {
  const displayDescription = description.length > 100 ? `${description.substring(0, 97)}...` : description; // Truncate description

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group h-full flex flex-col">
      <div className="relative flex-shrink-0">
        <img
          className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
          src={imageUrl}
          alt={title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          {toursCount} Articles
        </span>
      </div>
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center text-sm font-semibold text-purple-600 mb-2">
            {categoryIcon && <span className="mr-2 text-purple-500">{categoryIcon}</span>}
            {categoryName}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors duration-300">{title}</h3>
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">{displayDescription}</p>
        </div>
        <div
          className="text-purple-600 font-semibold flex items-center hover:text-purple-700 transition-colors duration-300 mt-auto"
        >
          View Category
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
};

export default TourCard; 