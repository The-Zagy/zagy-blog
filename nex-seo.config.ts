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
        images: [
            {
                url: 'https://www.example.ie/og-image-01.jpg',
                width: 800,
                height: 600,
                alt: 'Og Image Alt',
                type: 'image/jpeg',
            },
            {
                url: 'https://www.example.ie/og-image-02.jpg',
                width: 900,
                height: 800,
                alt: 'Og Image Alt Second',
                type: 'image/jpeg',
            },
            { url: 'https://www.example.ie/og-image-03.jpg' },
            { url: 'https://www.example.ie/og-image-04.jpg' },
        ],
    },
    twitter: {
        handle: '@handle',
        site: '@site',
        cardType: 'summary_large_image',
    },

};
