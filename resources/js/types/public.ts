export type RegistrationMode = 'open' | 'waitlist' | 'invite_only' | 'closed';

export type FeatureStatus = 'available' | 'beta' | 'planned' | 'disabled';

export interface PublicSiteAnnouncement {
    text: string;
    href?: string;
}

export interface PublicSiteProps {
    brandName: string;
    tagline: string;
    registrationMode: RegistrationMode;
    pricingVisible: boolean;
    contactFormEnabled: boolean;
    supportEmail: string | null;
    announcement: PublicSiteAnnouncement | null;
}

export interface FeatureItem {
    slug: string;
    title: string;
    summary: string;
    description?: string;
    category?: string;
    status: Exclude<FeatureStatus, 'disabled'>;
    iconKey?: string;
    featured?: boolean;
    href?: string;
}

export interface TemplateItem {
    slug: string;
    title: string;
    category: string;
    description: string | null;
    compilerEngine: string;
}

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export interface PricingPlanItem {
    slug: string;
    name: string;
    summary: string | null;
    priceAmount: number;
    currency: string;
    billingInterval: string;
    features: string[];
    ctaLabel: string;
    ctaType: string;
    ctaTarget: string | null;
}
