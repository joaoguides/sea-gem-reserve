// Helper function to get the correct image URL
export const getProductImage = (imageName: string | null | undefined): string => {
  if (!imageName) return "/placeholder.svg";
  
  // If it's a full URL (http or Supabase storage path), return as is
  if (imageName.startsWith("http") || imageName.startsWith("/lovable-uploads/")) {
    return imageName;
  }
  
  // If it's a placeholder, return as is
  if (imageName === "/placeholder.svg") return imageName;
  
  // Fallback to placeholder (all local assets removed)
  return "/placeholder.svg";
};
