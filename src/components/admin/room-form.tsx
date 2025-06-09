"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Save, Loader2, Plus } from "lucide-react";
import {
  RoomsAPI,
  CategoriesAPI,
  type Room,
  type CreateRoomData,
  type Category,
  type RoomImage,
} from "@/lib/api";
import ImageUpload from "./image-upload";
import { useCallback } from "react";
interface RoomFormProps {
  room?: Room | null;
  onClose: () => void;
}

export default function RoomForm({ room, onClose }: RoomFormProps) {
  const [formData, setFormData] = useState<CreateRoomData>({
    title: "",
    description: "",
    price: "",
    categoryId: 0,
    amenities: [],
    files: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [newAmenity, setNewAmenity] = useState("");
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<RoomImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const response = await CategoriesAPI.getAllCategories();
      if (response.success && response.data) {
        setCategories(response.data);
        if (!room && response.data && response.data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: response.data![0].id }));
        }
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  }, [room]);

  useEffect(() => {
    loadCategories();
    if (room) {
      setFormData({
        title: room.title,
        description: room.description,
        price: room.price,
        categoryId: room.categoryId,
        amenities: [...room.amenities],
        files: [],
      });
      if (room.images && room.images.length > 0) {
        setExistingImages(room.images);
      }
    }
  }, [room, loadCategories]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    // Validation
    if (!formData.title.trim()) {
      setError("Xona nomi majburiy");
      setIsSaving(false);
      return;
    }

    if (!formData.price.trim()) {
      setError("Narx majburiy");
      setIsSaving(false);
      return;
    }

    if (formData.categoryId === 0) {
      setError("Kategoriya tanlash majburiy");
      setIsSaving(false);
      return;
    }

    try {
      let response;

      // Add selected files to formData
      const dataToSend = {
        ...formData,
        files: selectedFiles,
      };

      if (room) {
        // If updating, add images to delete
        response = await RoomsAPI.updateRoom(room.id, {
          ...dataToSend,
          deleteImages: imagesToDelete.length > 0 ? imagesToDelete : undefined,
        });
      } else {
        response = await RoomsAPI.createRoom(dataToSend);
      }
      if (response.success) {
        alert(
          room
            ? "Xona muvaffaqiyatli yangilandi!"
            : "Yangi xona muvaffaqiyatli qo'shildi!"
        );
        onClose();
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

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()],
      });
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenityToRemove: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(
        (amenity) => amenity !== amenityToRemove
      ),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAmenity();
    }
  };

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleRemoveExistingImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setImagesToDelete((prev) => [...prev, imageId]);
  };
  console.log("Selected files:", selectedFiles);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            {room ? "Xonani Tahrirlash" : "Yangi Xona Qo'shish"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xona Nomi <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Masalan: Deluxe Suite"
                  required
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoriya <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId: Number.parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isSaving || isLoadingCategories}
                >
                  <option value={0}>Kategoriya tanlang</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {isLoadingCategories && (
                  <p className="text-xs text-gray-500 mt-1">
                    Kategoriyalar yuklanmoqda...
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Narx (so&lsquo;m/kecha){" "}
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Masalan: 150,000"
                  required
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Faqat raqam va vergul ishlatishingiz mumkin
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tavsif
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Xona haqida batafsil ma'lumot..."
                rows={4}
                disabled={isSaving}
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qulayliklar
              </label>
              <div className="flex space-x-2 mb-3">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Yangi qulaylik qo'shish"
                  onKeyPress={handleKeyPress}
                  disabled={isSaving}
                />
                <Button
                  type="button"
                  onClick={addAmenity}
                  size="icon"
                  variant="outline"
                  disabled={isSaving}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => !isSaving && removeAmenity(amenity)}
                  >
                    {amenity} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
              {formData.amenities.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  WiFi, TV, Konditsioner kabi qulayliklarni qo&lsquo;shing
                </p>
              )}
            </div>

            {/* Image Upload Section */}
            <ImageUpload
              selectedFiles={selectedFiles}
              onFilesChange={handleFilesChange}
              existingImages={existingImages}
              onRemoveExisting={handleRemoveExistingImage}
              disabled={isSaving}
            />

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={isSaving}
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                disabled={isSaving || formData.categoryId === 0}
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
  );
}
