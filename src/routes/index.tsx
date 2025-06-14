import {  Routes, Route } from "react-router-dom";
import LandingPage from "../features/landing/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import ArticleListPage from "../features/articles/pages/ArticleListPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import CategoriesPage from "../features/categories/pages/categoriesPage";
import ArticleDetailPage from "../features/articles/pages/ArticleDetailPage";

export default function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/articles" element={<ArticleListPage />} />
        <Route path="/articles/category/:categoryId" element={<ArticleListPage />} />
        <Route path="/articles/:documentId" element={<ArticleDetailPage />} />
      </Routes>
  );
} 