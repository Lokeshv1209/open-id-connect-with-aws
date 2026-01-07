"use client";
import Image from "next/image";
import React, { useState } from "react";

import WhitePencilSimple from "@/../public/WhitePencilSimple.svg";
import { CenterPopUp } from "@/components/shared-component/CenterPopUp";
import { Button } from "@/components/ui/button";
import { showSuccessToast } from "@/lib/toast";
import { useDeleteCategoryMutation } from "@/services/api-service/CategoryService";

export interface ICategory {
  categoryId: string;
  categoryName: string;
  iconUrl?: string;
  description?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryCardsProps {
  items: ICategory[];
  onEdit?: (id: ICategory) => void;
}

const CategoryCards: React.FC<CategoryCardsProps> = ({ items, onEdit }) => {
  const [deleteCategory, { isLoading: deleteLoading }] = useDeleteCategoryMutation();
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory>();

  const handleDelete = async (categoryId: string) => {
    const res = await deleteCategory({ categoryId });
    if (res?.data?.code == 200) {
      showSuccessToast("category deleted successfully");
      setOpenDeletePopUp(false);
    }
  };

  return (
    <div className=" p-5 grid grid-cols-1 gap-5 relative">
      {items.map((item) => (
        <div
          key={item?.categoryId}
          className="flex items-center justify-between p-3.5 bg-white rounded-xl shadow-sm"
        >
          <div className="flex items-center gap-4 h-[4rem] min-w-0">
            <div className=" flex-shrink-0 w-12 h-12 xl:w-16 xl:h-16 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden">
              {item?.iconUrl && item.iconUrl !== "" && item.iconUrl?.includes(".com") ? (
                <div className="relative w-full h-full p-1">
                  <Image
                    src={item.iconUrl}
                    alt={item?.categoryName}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10  rounded-full flex justify-center items-center">
                  {item?.categoryName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-[#282727] truncate ">{item?.categoryName}</h3>
              <p className="text-[#615F5FE5] text-xs font-normal truncate ">{item?.description}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => onEdit?.(item)}
              variant="gradientGreen"
              size="icon"
              className=" text-white rounded-lg flex items-center justify-center"
            >
              <Image src={WhitePencilSimple} alt="edit" className="w-4 h-4 text-[#FFF]" />
            </Button>
            {/* <Button
              onClick={() => {
                setOpenDeletePopUp(true);
                setSelectedCategory(item);
              }}
              className="w-9 h-9 bg-red-100 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-200 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </Button> */}
          </div>
        </div>
      ))}
      {openDeletePopUp && (
        <CenterPopUp
          heading="Confirm Delete Category"
          onClose={() => setOpenDeletePopUp(false)}
          buttons={[
            {
              label: "Cancel",
              variant: "gradientGray",
              onClick: () => setOpenDeletePopUp(false),
            },
            {
              label: "Delete",
              variant: "delete",
              isLoading: deleteLoading,
              onClick: () => handleDelete(selectedCategory?.categoryId as string),
            },
          ]}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gray-100">
              {selectedCategory?.iconUrl &&
              selectedCategory.iconUrl !== "" &&
              selectedCategory.iconUrl?.includes(".com") ? (
                <Image
                  src={selectedCategory.iconUrl}
                  alt={selectedCategory?.categoryName}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ) : (
                <div className="w-10 h-10  rounded-full flex justify-center items-center">
                  {selectedCategory?.categoryName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#282727]">
                {selectedCategory?.categoryName}
              </h3>
              <p className="text-[#615F5FE5] text-xs font-normal">
                {selectedCategory?.description}
              </p>
            </div>
          </div>
        </CenterPopUp>
      )}
    </div>
  );
};

export default CategoryCards;
