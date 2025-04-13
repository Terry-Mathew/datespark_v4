export const optimizeImageUrl = (url: string, width: number = 800) => {
  // If using UI Faces or similar service that already provides optimized images
  if (url.includes('ui-avatars.com')) {
    return url;
  }

  // For other images, you might want to use an image optimization service
  // Example with ImageKit.io (you would need to set up an account)
  // return `https://ik.imagekit.io/your_account/tr:w-${width}/${url}`;
  
  return url;
};

export const getImageDimensions = async (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = url;
  });
}; 