export interface TemplatePosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface TemplatePadding {
  horizontal: number;
  vertical: number;
}

export interface TemplateStyle {
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  padding?: TemplatePadding;
  borderRadius?: number;
  maxLines?: number;
  width?: number;
  height?: number;
  text?: string;
}

export interface TemplateElement {
  enabled?: boolean;
  position: TemplatePosition;
  style: TemplateStyle;
  type?: 'text' | 'rectangle' | 'circle' | 'image';
}

export interface TemplateBackground {
  type: 'color' | 'image' | 'gradient';
  value: string;
  gradient?: {
    enabled: boolean;
    direction: 'horizontal' | 'vertical' | 'diagonal';
    colors: string[];
  };
}

export interface TemplateDimensions {
  width: number;
  height: number;
}

export interface TemplateOverlay {
  enabled: boolean;
  opacity?: number;
  blendMode?: string;
  position?: TemplatePosition;
}

export interface ImageTemplate {
  name: string;
  description: string;
  dimensions: TemplateDimensions;
  background: TemplateBackground;
  elements: {
    category?: TemplateElement;
    title: TemplateElement;
    subtitle?: TemplateElement;
    logo?: TemplateElement;
    accent?: TemplateElement;
  };
  overlays?: {
    backgroundImage?: TemplateOverlay;
  };
}

export interface ImageGenerationData {
  title: string;
  subtitle?: string;
  category?: string;
  backgroundImage?: string;
  template: string;
  format?: 'png' | 'jpeg' | 'webp' | 'svg';
  quality?: number;
}
