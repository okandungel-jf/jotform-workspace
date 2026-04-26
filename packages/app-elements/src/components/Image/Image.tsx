import { useState, type FC, type DragEvent } from 'react';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button';
import './Image.scss';

export type ImageAlignment = 'Left' | 'Center' | 'Right';
export type ImageSize = 'Normal' | 'Large';

export interface ImageProps {
  alignment?: ImageAlignment;
  size?: ImageSize;
  hasImage?: boolean;
  imageUrl?: string;
  altText?: string;
  width?: number;
  height?: number;
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

export const Image: FC<ImageProps> = ({
  alignment = 'Left',
  size = 'Normal',
  hasImage = false,
  imageUrl,
  altText = '',
  width,
  height,
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
}) => {
  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';
  const [isDragging, setIsDragging] = useState(false);

  // =====================
  // Skeleton state
  // =====================
  if (skeleton && hasImage) {
    const rootClasses = [
      'jf-image',
      `jf-image--${alignment.toLowerCase()}`,
      `jf-image--${size.toLowerCase()}`,
      shrinked && 'jf-image--shrinked',
    ].filter(Boolean).join(' ');
    return (
      <div className={rootClasses}>
        <div className={`jf-image__media jf-skeleton__bone ${animClass}`} />
      </div>
    );
  }

  // =====================
  // Upload (no image yet)
  // =====================
  if (!hasImage || !imageUrl) {
    const builderClasses = [
      'jf-image-builder',
      isDragging && 'jf-image-builder--active',
      selected && 'jf-image-builder--selected',
      shrinked && 'jf-image-builder--shrinked',
    ].filter(Boolean).join(' ');

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    return (
      <div
        className={builderClasses}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDragging ? (
          <>
            <Icon name="CirclePlus" size={20} className="jf-image-builder__drop-icon" />
            <span className="jf-image-builder__hint">DRAG AND DROP HERE</span>
          </>
        ) : (
          <>
            <Icon name="Image" size={32} className="jf-image-builder__icon" />
            <Button
              variant="Default"
              corner="Default"
              size="Small"
              label="Upload Image"
              leftIcon="Upload"
              rightIcon="none"
              shrinked
            />
            <span className="jf-image-builder__hint">OR DRAG AND DROP HERE</span>
          </>
        )}
      </div>
    );
  }

  // =====================
  // Image with content
  // =====================
  const rootClasses = [
    'jf-image',
    `jf-image--${alignment.toLowerCase()}`,
    `jf-image--${size.toLowerCase()}`,
    selected && 'jf-image--selected',
    shrinked && 'jf-image--shrinked',
  ].filter(Boolean).join(' ');

  const mediaStyle: React.CSSProperties = {};
  if (width != null && height != null) {
    mediaStyle.width = `${width}px`;
    mediaStyle.height = `${height}px`;
    mediaStyle.maxWidth = '100%';
  } else if (width != null) {
    mediaStyle.width = `${width}px`;
    mediaStyle.height = 'auto';
    mediaStyle.maxWidth = '100%';
  } else if (height != null) {
    mediaStyle.width = '100%';
    mediaStyle.height = 'auto';
    mediaStyle.maxHeight = `${height}px`;
    mediaStyle.objectFit = 'cover';
  }

  return (
    <div className={rootClasses}>
      <img className="jf-image__media" src={imageUrl} alt={altText} style={mediaStyle} />
    </div>
  );
};

export default Image;
