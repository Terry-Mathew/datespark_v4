
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  title: string;
  description: string;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

const ImageUploader = ({
  onImageUpload,
  title,
  description,
  acceptedTypes = "image/jpeg, image/png, image/jpg",
  maxSizeMB = 5
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndUpload(files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndUpload(files[0]);
    }
  };
  
  const validateAndUpload = (file: File) => {
    // Check file type
    if (!file.type.match(acceptedTypes.replace(/\s/g, ''))) {
      toast.error(`Invalid file type. Please upload ${acceptedTypes.replace(/image\//g, '')}`);
      return;
    }
    
    // Check file size
    if (file.size > maxSizeBytes) {
      toast.error(`File is too large. Maximum size is ${maxSizeMB}MB`);
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Call the upload handler
    onImageUpload(file);
  };
  
  const clearImage = () => {
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-[400px] object-contain bg-black/5"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
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
              Choose File
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {acceptedTypes.replace(/image\//g, '')} up to {maxSizeMB}MB
            </p>
          </div>
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            accept={acceptedTypes}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
