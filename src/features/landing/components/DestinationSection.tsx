import  { useEffect } from "react";
import { useArticleStore } from "../../../stores/articleStore";
import { useCategoryStore } from "../../../stores/categoryStore";
import { Plane, Map, Heart, ArrowRight } from "lucide-react";
import ArticlesCard from "../../articles/components/ArticlesCard";

export default function DestinationSection({isAuthenticated} : {isAuthenticated:boolean;}) {
  const { articles, fetchArticles } = useArticleStore();
  const {  fetchAllData: fetchCategories } = useCategoryStore();
  

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [fetchArticles, fetchCategories]);

  const displayedArticles = articles.slice(0,4);



  return (
    <section className="py-10 lg:py-20 px-4 bg-lime-100 relative overflow-hidden mx-3 md:mx-4 lg:mx-10 rounded-xl shadow mb-16">
      <div className="absolute top-20 left-20 opacity-20 transform -rotate-12">
        <Map size={75} className="text-400" />
      </div>
      <div className="absolute top-10 right-10 opacity-20 transform rotate-12">
        <Plane size={75} className="text-400" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 transform -rotate-12">
        <Heart size={75} className="text-400" />
      </div>

      <div className="container mx-auto px-0 lg:px-4 relative z-10">
        <div className="text-center mb-12">
          <h4 className="text-sm font-semibold text-red-500 uppercase mb-2">Top Destinations</h4>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">The best destinations</h2>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedArticles.map((article,i) => (
              <ArticlesCard article={article} key={i} isAuthenticated={isAuthenticated}/>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-10 ">
            <a href="/articles" className="p-3 text-lime-800 hover:text-purple-800 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center">
              View More <ArrowRight className="ml-1 w-4 h-4" />
            </a>
            
          </div>
      </div>
    </section>
  );
} 