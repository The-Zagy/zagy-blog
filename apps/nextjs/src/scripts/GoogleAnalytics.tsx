import Script from "next/script"

export const GoogleAnalytics = () => {
    return (<><Script
        src="https://www.googletagmanager.com/gtag/js?id=G-ETQM0CS8Q1"
        strategy="afterInteractive"
    />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-ETQM0CS8Q1');
    `}
        </Script></>)
}