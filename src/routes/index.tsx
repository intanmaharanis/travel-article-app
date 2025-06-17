import React from "react";
import { Routes, Route } from "react-router-dom";

const LandingPage = React.lazy(() => import("../features/landing/pages/LandingPage"));
const LoginPage = React.lazy(() => import("../features/auth/pages/LoginPage"));
const ArticleListPage = React.lazy(() => import("../features/articles/pages/ArticleListPage"));
const RegisterPage = React.lazy(() => import("../features/auth/pages/RegisterPage"));
const CategoriesPage = React.lazy(() => import("../features/categories/pages/categoriesPage"));
const ArticleDetailPage = React.lazy(() => import("../features/articles/pages/ArticleDetailPage"));

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