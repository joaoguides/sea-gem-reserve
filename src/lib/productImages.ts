// Import all product images
import azimutGrande27 from "@/assets/azimut-grande-27.jpg";
import ferretti850 from "@/assets/ferretti-850.jpg";
import sunseekerPredator74 from "@/assets/sunseeker-predator-74.jpg";
import princessV78 from "@/assets/princess-v78.jpg";
import intermarine60 from "@/assets/intermarine-60.jpg";
import boat1 from "@/assets/boat-1.jpg";
import boat2 from "@/assets/boat-2.jpg";
import boat3 from "@/assets/boat-3.jpg";
import boat4 from "@/assets/boat-4.jpg";

// Map image names to imported assets
export const productImageMap: Record<string, string> = {
  "azimut-grande-27.jpg": azimutGrande27,
  "ferretti-850.jpg": ferretti850,
  "sunseeker-predator-74.jpg": sunseekerPredator74,
  "princess-v78.jpg": princessV78,
  "intermarine-60.jpg": intermarine60,
  "boat-1.jpg": boat1,
  "boat-2.jpg": boat2,
  "boat-3.jpg": boat3,
  "boat-4.jpg": boat4,
};

// Helper function to get the correct image URL
export const getProductImage = (imageName: string | null | undefined): string => {
  if (!imageName) return "/placeholder.svg";
  
  // If it's a full URL (http or Supabase storage path), return as is
  if (imageName.startsWith("http") || imageName.startsWith("/lovable-uploads/")) {
    return imageName;
  }
  
  // If it's a placeholder, return as is
  if (imageName === "/placeholder.svg") return imageName;
  
  // Try to get from our imported images map
  const mappedImage = productImageMap[imageName];
  if (mappedImage) return mappedImage;
  
  // Fallback to placeholder
  return "/placeholder.svg";
};
