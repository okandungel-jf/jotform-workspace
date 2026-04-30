import { useRef, type FC } from 'react';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button';
import { compressImageFiles } from '../../utils/compressImage';
import './ImageGallery.scss';

export type GalleryLayout = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export interface ImageGalleryProps {
  layout?: GalleryLayout;
  images?: string[];
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
  onUpload?: (urls: string[]) => void;
}

// Grid definitions per layout
const LAYOUT_CONFIG: Record<GalleryLayout, {
  cols: string;
  rows: string;
  cells: { col: string; row: string }[];
  aspectRatio?: string;
}> = {
  // Layout 1: 1col × 2row — 2 images stacked
  '1': {
    cols: 'repeat(1, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1' },
      { col: '1', row: '2' },
    ],
    aspectRatio: '1 / 2',
  },
  // Layout 2: 2col × 2row — 4 equal images
  '2': {
    cols: 'repeat(2, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
      { col: '1', row: '2' },
      { col: '2', row: '2' },
    ],
  },
  // Layout 3: 3col × 2row — 6 equal images
  '3': {
    cols: 'repeat(3, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
      { col: '3', row: '1' },
      { col: '1', row: '2' },
      { col: '2', row: '2' },
      { col: '3', row: '2' },
    ],
    aspectRatio: '3 / 2',
  },
  // Layout 4: left full height, right 2 stacked
  '4': {
    cols: 'repeat(2, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1 / span 2' },
      { col: '2', row: '1' },
      { col: '2', row: '2' },
    ],
  },
  // Layout 5: right full height, left 2 stacked
  '5': {
    cols: 'repeat(2, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1 / span 2' },
      { col: '1', row: '2' },
    ],
  },
  // Layout 6: top full width, bottom 2 side by side
  '6': {
    cols: 'repeat(2, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1 / span 2', row: '1' },
      { col: '1', row: '2' },
      { col: '2', row: '2' },
    ],
  },
  // Layout 7: top 2 side by side, bottom full width
  '7': {
    cols: 'repeat(2, 1fr)',
    rows: 'repeat(2, 1fr)',
    cells: [
      { col: '1', row: '1' },
      { col: '2', row: '1' },
      { col: '1 / span 2', row: '2' },
    ],
  },
  // Layout 8: 4×4 grid — top-left small, bottom-left big, top-right big, bottom-right small
  '8': {
    cols: 'repeat(4, 1fr)',
    rows: 'repeat(4, 1fr)',
    cells: [
      { col: '1 / span 2', row: '1' },
      { col: '1 / span 2', row: '2 / span 3' },
      { col: '3 / span 2', row: '1 / span 3' },
      { col: '3 / span 2', row: '4' },
    ],
  },
  // Layout 9: 4×4 grid — top-left big, top-right small, bottom-left small, bottom-right big
  '9': {
    cols: 'repeat(4, 1fr)',
    rows: 'repeat(4, 1fr)',
    cells: [
      { col: '1 / span 3', row: '1 / span 2' },
      { col: '1', row: '3 / span 2' },
      { col: '4', row: '1 / span 2' },
      { col: '2 / span 3', row: '3 / span 2' },
    ],
  },
};

export const ImageGallery: FC<ImageGalleryProps> = ({
  layout = '2',
  images = [],
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0 || !onUpload) return;
    compressImageFiles(files).then((urls) => onUpload([...images, ...urls]));
  };
  const config = LAYOUT_CONFIG[layout];

  const rootClasses = [
    'jf-gallery',
    selected && 'jf-gallery--selected',
    shrinked && 'jf-gallery--shrinked',
  ].filter(Boolean).join(' ');

  const gridStyle = {
    gridTemplateColumns: config.cols,
    gridTemplateRows: config.rows,
    ...(config.aspectRatio ? { aspectRatio: config.aspectRatio } : {}),
  };

  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  if (skeleton) {
    return (
      <div
        className={rootClasses}
        style={{ ...gridStyle, background: 'var(--bg-surface)' }}
      >
        {config.cells.map((cell, i) => (
          <div
            key={i}
            className={`jf-gallery__cell jf-skeleton__bone ${animClass}`}
            style={{
              gridColumn: cell.col,
              gridRow: cell.row,
            }}
          />
        ))}
      </div>
    );
  }

  // Empty state — no images uploaded yet.
  if (images.length === 0) {
    return (
      <div className="jf-gallery-uploader">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <Icon name="Images" size={32} className="jf-gallery-uploader__icon" />
        <Button
          variant="Default"
          corner="Default"
          size="Small"
          label="Upload Images"
          leftIcon="Upload"
          rightIcon="none"
          shrinked
          onClick={() => fileInputRef.current?.click()}
        />
        <span className="jf-gallery-uploader__hint">OR DRAG AND DROP HERE</span>
      </div>
    );
  }

  return (
    <div
      className={rootClasses}
      style={gridStyle}
    >
      {config.cells.map((cell, i) => {
        const src = images[i];
        return (
          <div
            key={i}
            className="jf-gallery__cell"
            style={{
              gridColumn: cell.col,
              gridRow: cell.row,
            }}
          >
            {src && (
              <img
                className="jf-gallery__img"
                src={src}
                alt={`Gallery image ${i + 1}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImageGallery;
