import { useEffect } from "react";
import { useCategoryStore } from "../../../stores/categoryStore";
import CategoryCard from "../../../components/CategoryCard";
import { getRandomIcon } from "../../../constants/icons";

export default function CategorySection() {
  const { categories, fetchAllData } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0) {
      fetchAllData();
    }
  }, [categories.length, fetchAllData]);

  const displayedCategories = categories.slice(0, 4); // Limit to 4 categories

  return (
    <section className="py-20 px-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">New Adventures</h4>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Next Great Trip
            </h2>
            <p className="text-gray-600 max-w-2xl hidden">
              Find the perfect travel experience that matches your preferences and interests
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="p-3 bg-lime-200 rounded-lg text-lime-800 hover:bg-lime-300 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="p-3 bg-lime-200 rounded-lg text-lime-800 hover:bg-lime-300 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedCategories.map((category, index) => {
            const Icon = getRandomIcon(index);
            return (
              <CategoryCard key={category.id} category={category} Icon={Icon} />
            );
          })}
        </div>
      </div>
    </section>
  );
} 