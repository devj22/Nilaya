import React from "react";
import { Card } from "@/components/ui/card";
import { Image as ImageIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
}

const GallerySection: React.FC = () => {
  // Hardcoded gallery images - you can easily add/remove/modify these
  const images: GalleryImage[] = [
    {
      id: 1,
      url: "https://i.ibb.co/PsMbLDRT/Bird-Eye-View-001.jpg",
      alt: "Bird's eye view of the property"
    },
    {
      id: 2,
      url: "https://i.ibb.co/vN9Dn56/Day-View-Inside-001-A.jpg",
      alt: "Day view inside the property"
    },
    {
      id: 3,
      url: "https://i.ibb.co/ymGVnSD1/Gate-View-001.jpg",
      alt: "Coastal luxury property"
    },
    {
      id: 4,
      url: "https://i.ibb.co/DP987gpQ/Living-room.jpg",
      alt: "Modern beachfront development"
    },
    // Add more images here by copying the format above
    // Example:
    // {
    //   id: 5,
    //   url: "https://your-image-url-here.com/image.jpg",
    //   alt: "Description of the image"
    // },
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 mb-6">Gallery</h2>
          <div className="w-24 h-1 bg-gradient-coastal mx-auto mb-8"></div>
          <p className="text-xl text-gray-600">Explore our project photos</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {images.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 flex flex-col items-center">
              <ImageIcon className="w-12 h-12 mb-2" />
              <span>No images yet</span>
            </div>
          ) : (
            images.map((img, idx) => (
              <Card key={img.id} className="overflow-hidden rounded-2xl shadow-2xl relative">
                <AspectRatio ratio={4/3}>
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="rounded-2xl shadow-2xl w-full h-full object-cover"
                    loading="lazy"
                  />
                </AspectRatio>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default GallerySection; 