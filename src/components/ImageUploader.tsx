// src/components/ImageUploader.tsx
import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, FileText as FileTextIcon } from "lucide-react"; // Added FileTextIcon
import { toast } from "sonner";

interface ImageUploaderProps {
  // Changed to accept File array or null
  onImageUpload: (files: File[] | null) => void; 
  title: string;
  description: string;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

const ImageUploader = ({
  onImageUpload,
  title,
  description,
  acceptedTypes = "image/jpeg, image/png, image/webp, image/gif",
  maxSizeMB = 5,
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  // Store multiple previews or file data if needed, for now, one preview and list of names
  const [firstPreview, setFirstPreview] = useState<string | null>(null);
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Better function to check if a file is a valid image type
  const isValidImageType = (file: File, acceptedTypes: string): boolean => {
    // Convert acceptedTypes to an array of clean MIME types
    const acceptedTypesArray = acceptedTypes
      .split(',')
      .map(type => type.trim());
    
    // Check basic MIME type first
    if (acceptedTypesArray.includes(file.type)) {
      return true;
    }
    
    // Handle JPEG/JPG special case
    if ((file.type === 'image/jpeg' && acceptedTypesArray.includes('image/jpg')) ||
        (file.type === 'image/jpg' && acceptedTypesArray.includes('image/jpeg'))) {
      return true;
    }
    
    // More relaxed check: see if the file type starts with "image/"
    if (file.type.startsWith('image/') && 
        (acceptedTypesArray.includes('image/jpeg') || 
         acceptedTypesArray.includes('image/jpg') ||
         acceptedTypesArray.includes('image/png') ||
         acceptedTypesArray.includes('image/webp') ||
         acceptedTypesArray.includes('image/gif'))) {
      return true;
    }
    
    return false;
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      setFirstPreview(null);
      setSelectedFileNames([]);
      onImageUpload(null);
      return;
    }

    const validFiles: File[] = [];
    const names: string[] = [];
    let firstValidPreviewSet = false;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Use our improved validation function
      if (!isValidImageType(file, acceptedTypes)) {
        toast.error(
          `File "${file.name}" has an invalid type. Please upload JPEG, PNG, WEBP, or GIF.`
        );
        continue; // Skip this file
      }
      
      if (file.size > maxSizeBytes) {
        toast.error(
          `File "${file.name}" is too large. Maximum size is ${maxSizeMB}MB`
        );
        continue; // Skip this file
      }
      validFiles.push(file);
      names.push(file.name);

      if (!firstValidPreviewSet) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFirstPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        firstValidPreviewSet = true;
      }
    }

    setSelectedFileNames(names);
    if (validFiles.length === 0) {
        setFirstPreview(null); // Clear preview if no valid files
        onImageUpload(null); 
    } else {
        // Pass the array of valid files directly
        onImageUpload(validFiles);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const clearImages = () => {
    setFirstPreview(null);
    setSelectedFileNames([]);
    if (inputRef.current) {
      inputRef.current.value = ""; // Clears the file input
    }
    onImageUpload(null); // Notify parent that selection is cleared
  };

  return (
    <div className="w-full">
      {(firstPreview || selectedFileNames.length > 0) && (
        <div className="mb-4 p-4 border border-border rounded-xl">
          {firstPreview && (
            <div className="relative rounded-md overflow-hidden border border-input mb-2">
              <img
                src={firstPreview}
                alt="Preview of first image"
                className="w-full h-auto max-h-[200px] object-contain bg-black/5"
              />
            </div>
          )}
          {selectedFileNames.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Selected Files:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground max-h-[100px] overflow-y-auto">
                {selectedFileNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={clearImages}
          >
            <X className="mr-2 h-4 w-4" /> Clear Selection
          </Button>
        </div>
      )}

      {!firstPreview && selectedFileNames.length === 0 && (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-muted p-3">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              {description}
            </p>
            <Button className="mt-4" size="sm" variant="secondary">
              <Upload className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {acceptedTypes.replace(/image\//g, "")} up to {maxSizeMB}MB each
            </p>
          </div>
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            accept={acceptedTypes}
            multiple // <-- Key change: allow multiple file selection
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
