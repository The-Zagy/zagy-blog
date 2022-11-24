import { DefaultSeoProps } from 'next-seo';
//todo add default meta tags
//todo 2 change the url to env variable when deployed?
export const NEXT_SEO_DEFAULT: DefaultSeoProps = {
    title: 'Zagy blog',
    description: 'Zagy tech blog',
    openGraph: {
        type: 'website',
        locale: 'en_IE',
        url: "CHANGE MEE",
        siteName: 'Zagy blog',
    },
    twitter: {
        handle: '@handle',
        site: '@site',
        cardType: 'summary_large_image',
    },

};
