import { useEffect } from "react";
import { useCategoryStore } from "../../../stores/categoryStore";
import CategoryCard from "../../categories/components/CategoryCard";
import { getRandomIcon } from "../../../constants/icons";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategorySection({isAuthenticated} : {isAuthenticated: boolean}) {
  const { categories, fetchAllData } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchAllData();
    }
  }, [categories.length, fetchAllData]);

  const displayedCategories = categories.slice(0, 4); // Limit to 4 categories

  return (
    <section className="py-20 px-2 md:px-8 lg:px-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">New Adventures</h4>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Your Next Great Trip
            </h2>
            <p className="text-gray-600 max-w-2xl hidden">
              Find the perfect travel experience that matches your preferences and interests
            </p>
          </div>
          <div className="flex space-x-2">
            <Link to="/categories" className="p-3 text-lime-800 hover:text-lime-600 transition flex items-center">
              View More <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedCategories.map((category, index) => {
            const Icon = getRandomIcon(index);
            return (
              <CategoryCard key={category.id} category={category} Icon={Icon} isAuthenticated={isAuthenticated} />
            );
          })}
        </div>
      </div>
    </section>
  );
} 