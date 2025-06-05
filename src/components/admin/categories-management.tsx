"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import {
  CategoriesAPI,
  type Category,
  type CreateCategoryData,
} from "@/lib/api";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({ name: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await CategoriesAPI.getAllCategories();

      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.error || "Kategoriyalarni yuklashda xatolik");
      }
    } catch (error) {
      console.error(error);
      setError("Serverga ulanishda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm("Haqiqatan ham bu kategoriyani o'chirmoqchimisiz?")) {
      return;
    }

    try {
      const response = await CategoriesAPI.deleteCategory(categoryId);

      if (response.success) {
        setCategories(
          categories.filter((category) => category.id !== categoryId),
        );
        alert("Kategoriya muvaffaqiyatli o'chirildi");
      } else {
        alert(
          "Xatolik: " + (response.error || "Kategoriyani o'chirishda xatolik"),
        );
      }
    } catch (error) {
      console.error(error);
      alert("Serverga ulanishda xatolik");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: "" });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    if (!formData.name.trim()) {
      setError("Kategoriya nomi majburiy");
      setIsSaving(false);
      return;
    }

    try {
      let response;

      if (editingCategory) {
        response = await CategoriesAPI.updateCategory(
          editingCategory.id,
          formData,
        );
      } else {
        response = await CategoriesAPI.createCategory(formData);
      }

      if (response.success) {
        alert(
          editingCategory
            ? "Kategoriya muvaffaqiyatli yangilandi!"
            : "Yangi kategoriya muvaffaqiyatli qo'shildi!",
        );
        setIsFormOpen(false);
        setEditingCategory(null);
        setFormData({ name: "" });
        loadCategories();
      } else {
        setError(response.error || "Ma'lumotlarni saqlashda xatolik");
      }
    } catch (error) {
      console.error(error);
      setError("Serverga ulanishda xatolik");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setFormData({ name: "" });
    setError("");
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (error && !isFormOpen) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={loadCategories} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Qayta urinish
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Kategoriyalar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Kategoriyalarni qidirish..."
              className="pl-10 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={loadCategories} variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yangi Kategoriya
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card
            key={category.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>
                  ID: <span className="font-mono">{category.id}</span>
                </p>
                <p>
                  Yaratilgan:{" "}
                  <span className="font-medium">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  Yangilangan:{" "}
                  <span className="font-medium">
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </span>
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEdit(category)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Tahrirlash
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {searchTerm
              ? "Qidiruv bo'yicha kategoriyalar topilmadi"
              : "Hozircha kategoriyalar mavjud emas"}
          </p>
        </div>
      )}

      {/* Category Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {editingCategory
                  ? "Kategoriyani Tahrirlash"
                  : "Yangi Kategoriya Qo'shish"}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={handleFormClose}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriya Nomi <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="Masalan: Standart Xonalar"
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleFormClose}
                    disabled={isSaving}
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saqlanmoqda...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Saqlash
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
