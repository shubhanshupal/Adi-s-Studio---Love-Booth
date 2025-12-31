export interface PhotoStripConfig {
    frameColor: string;
    message: string;
    layout: 'vertical' | 'grid';
}

export type AppScreen = 'home' | 'layout' | 'booth' | 'result';

export type FilterType = 'normal' | 'grayscale' | 'sepia' | 'soft' | 'vintage';

export interface GeneratedQuote {
    text: string;
}

export interface LayoutTheme {
    id: string;
    name: string;
    description: string;
    color: string;
    textColor: string;
    secondaryColor: string;
    pattern?: 'none' | 'film' | 'hearts' | 'stars' | 'gradient';
}