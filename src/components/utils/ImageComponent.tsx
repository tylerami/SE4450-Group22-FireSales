import React, { useState, useEffect } from "react";
import { getImageUrl } from "../../services/ImageService";
import { Box, Flex, Image, Spinner } from "@chakra-ui/react";

interface ImageComponentProps {
  imagePath: string;
  height?: string;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  minHeight?: string;
  minWidth?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  imagePath,
  height = "100%",
  width = "100%",
  maxWidth = "100%",
  maxHeight = "100%",
}: ImageComponentProps) => {
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
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      minHeight={maxHeight}
      margin="auto"
      display="flex"
      justifyContent={"center"}
      alignItems={"center"}
    >
      {isLoading || !imageUrl ? (
        <Spinner size="xl" />
      ) : (
        <Image
          maxHeight={"100%"}
          maxWidth={"100%"}
          src={imageUrl}
          alt="Not found"
        />
      )}
    </Box>
  );
};

export default ImageComponent;
