import React, { useState } from 'react';
import { ImageBackground, ImageBackgroundProps, StyleSheet, Text, View } from 'react-native';

interface ImageWithFallbackProps extends ImageBackgroundProps {
  fallbackText?: string;
  fallbackColor?: string;
  textColor?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  source,
  fallbackText = '',
  fallbackColor = '#E53E3E',
  textColor = '#ffffff',
  children,
  style,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError) {
    return (
      <View style={[style, styles.fallbackContainer, { backgroundColor: fallbackColor }]}>
        <Text style={[styles.fallbackText, { color: textColor }]} numberOfLines={2}>
          {fallbackText}
        </Text>
        {children}
      </View>
    );
  }

  return (
    <ImageBackground
      {...props}
      source={source}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  fallbackText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});