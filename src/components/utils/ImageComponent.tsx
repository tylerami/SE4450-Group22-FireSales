import React, { useState, useEffect } from "react";
import { getImageUrl } from "../../services/ImageService";
import { Box, Spinner } from "@chakra-ui/react";

interface ImageComponentProps {
  imagePath: string;
  height?: string;
  width?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  imagePath,
  height,
  width,
}: {
  imagePath: string;
  height?: string;
  width?: string;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    getImageUrl(imagePath)
      .then((url) => {
        setImageUrl(url);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading image", error);
        setIsLoading(false);
      });
  }, [imagePath]);

  return (
    <Box
      height={height}
      w={width}
      margin="auto"
      display="flex"
      justifyContent={"center"}
      alignItems={"center"}
    >
      {isLoading || !imageUrl ? (
        <Spinner size="xl" />
      ) : (
        <img src={imageUrl} alt="Not found" />
      )}
    </Box>
  );
};

export default ImageComponent;
