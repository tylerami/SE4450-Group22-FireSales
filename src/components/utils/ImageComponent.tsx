import React, { useState, useEffect } from "react";
import { Box, Image, Spinner } from "@chakra-ui/react";
import { ImageService } from "services/interfaces/ImageService";
import { DependencyInjection } from "models/utils/DependencyInjection";

interface ImageComponentProps {
  imagePath?: string;
  imageUrl?: string | null;
  height?: string;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  minHeight?: string;
  minWidth?: string;
  margin?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  imagePath,
  imageUrl,
  height,
  width,
  maxWidth = "100%",
  maxHeight = "100%",
  margin = "auto",
}: ImageComponentProps) => {
  const imageService: ImageService = DependencyInjection.imageService();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);

    async function fetchImage() {
      if (imageUrl) {
        setImageSrc(imageUrl);
      } else if (imagePath) {
        const imageUrl = await imageService.getImageUrl(imagePath);
        setImageSrc(imageUrl);
      }
      setIsLoading(false);
    }

    fetchImage();
  }, [imagePath, imageService, imageUrl]);

  return (
    <Box
      height={height}
      w={width}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      minHeight={maxHeight}
      margin={margin}
      display="flex"
      justifyContent={"center"}
      alignItems={"center"}
    >
      {isLoading || !imageSrc ? (
        <Spinner size="xl" />
      ) : (
        <Image
          maxHeight={"100%"}
          maxWidth={"100%"}
          src={imageSrc}
          alt="Not found"
        />
      )}
    </Box>
  );
};

export default ImageComponent;
