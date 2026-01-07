import Image from "next/image";
import React, { useRef, useState } from "react";

import EmptyImage from "@/../public/EmptyImage.svg";
import { showErrorToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

export interface IImageData {
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface IProp {
  allowedFileType: string[];
  maxFileSizeMB: number;
  image?: string | File | null;
  onFileSelect: (file: File | null) => void;
}

function CustomImageUploader({ allowedFileType, maxFileSizeMB, image, onFileSelect }: IProp) {
  const [imageData, setImageData] = useState<IImageData | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      showErrorToast("Invalid file type. Only images are allowed.");
      return false;
    }

    if (!allowedFileType.includes(file.type)) {
      showErrorToast(`Invalid file format. Allowed types: ${allowedFileType.join(", ")}`);
      return false;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSizeMB) {
      showErrorToast(`File size exceeds ${maxFileSizeMB}MB limit.`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setImageData({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
      onFileSelect(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "relative border-[2px] bg-[#F6F6F666] w-[9.13rem] h-[9.13rem] border-dashed rounded-xl p-2 text-center transition-all duration-200 flex flex-col items-center justify-center hover:cursor-pointer",
          isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedFileType.join(",")}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {typeof image === "string" ? (
          <div className="relative w-[8rem] h-[8rem]">
            <Image
              src={preview || image}
              alt="Uploaded image preview"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        ) : (
          <>
            {imageData ? (
              <div className="relative w-[8rem] h-[8rem]">
                <Image
                  src={preview as string}
                  alt="Image preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-lg mx-auto flex items-center justify-center">
                  <Image className="w-12 h-12" src={EmptyImage} alt="Empty" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Button
        type="button"
        variant="noOutline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-2 text-xs font-medium shadow-lg rounded-md bg-gray-200 text-[#064738]"
      >
        Browse
      </Button>
    </div>
  );
}

export default CustomImageUploader;
