import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GalleryImage {
  url: string;
}

const GallerySection: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('adminToken') === 'admin123';

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) {
        setImages(data.images.map((url: string) => ({ url })));
      }
    } catch (err) {
      setError("Failed to load gallery images");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setUploading(true);
    const formData = new FormData();
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
      try {
        const res = await fetch("/api/gallery/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          fetchImages();
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
          setError(data.message || "Upload failed");
        }
      } catch (err) {
        setError("Upload failed");
      }
    }
    setUploading(false);
  };

  const handleDelete = async (imgUrl: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    setError(null);
    const filename = imgUrl.split("/").pop()?.split("?")[0];
    try {
      const res = await fetch(`/api/gallery/${filename}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchImages();
      } else {
        setError(data.message || "Delete failed");
      }
    } catch (err) {
      setError("Delete failed");
    }
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">Gallery</h2>
          <div className="w-24 h-1 bg-gradient-coastal mx-auto mb-8"></div>
          <p className="text-xl text-gray-600">Explore our project photos</p>
        </div>
        {isAdmin && (
          <form onSubmit={handleUpload} className="mb-8 flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="block"
              required
            />
            <Button type="submit" className="flex items-center gap-2" disabled={uploading}>
              <UploadCloud className="h-5 w-5" />
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </form>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {images.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 flex flex-col items-center">
              <ImageIcon className="w-12 h-12 mb-2" />
              <span>No images yet</span>
            </div>
          ) : (
            images.map((img, idx) => (
              <Card key={idx} className="overflow-hidden rounded-2xl shadow-2xl relative">
                <AspectRatio ratio={4/3}>
                  <img
                    src={img.url}
                    alt={`Gallery ${idx + 1}`}
                    className="rounded-2xl shadow-2xl w-full h-full object-cover"
                    loading="lazy"
                  />
                </AspectRatio>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(img.url)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 shadow hover:bg-red-700 transition"
                    title="Delete image"
                  >
                    &times;
                  </button>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default GallerySection; 