import { DefaultSeoProps } from 'next-seo';
//todo add default meta tags
//todo 2 change the url to env variable when deployed?
export const NEXT_SEO_DEFAULT: DefaultSeoProps = {
    title: 'Zagy blog',
    description: 'Zagy tech blog',
    openGraph: {
        type: 'website',
        locale: 'en_IE',
        url: "https://zagy.tech/",
        siteName: 'Zagy blog',
        images: [
            {
                url: 'https://serving.photos.photobox.com/220525832dc353515a20d946b9f481fa37247c97d3be6f32fa37fbedfd904f1e87a0d98c.jpg',
                width: 800,
                height: 600,
                alt: 'Og Image Alt',
                type: 'image/jpeg',
            },
            {
                url: 'https://serving.photos.photobox.com/220525832dc353515a20d946b9f481fa37247c97d3be6f32fa37fbedfd904f1e87a0d98c.jpg',
                width: 900,
                height: 800,
                alt: 'Og Image Alt Second',
                type: 'image/jpeg',
            },
            { url: 'https://serving.photos.photobox.com/220525832dc353515a20d946b9f481fa37247c97d3be6f32fa37fbedfd904f1e87a0d98c.jpg' },
            { url: 'https://serving.photos.photobox.com/220525832dc353515a20d946b9f481fa37247c97d3be6f32fa37fbedfd904f1e87a0d98c.jpg' },
        ],
    },

};
