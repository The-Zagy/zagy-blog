import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react"
const Comments: React.FC = () => {
    const ref = useRef<HTMLDivElement | null>(null);
    const { theme } = useTheme();
    useEffect(() => {
        if (!theme) return
        const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
        if (iframe) {
            iframe.contentWindow?.postMessage({
                giscus: {
                    setConfig: {
                        theme
                    }
                }
            })
        }
        const scriptElement = document.createElement('script');
        scriptElement.async = true;
        scriptElement.crossOrigin = 'anonymous';
        scriptElement.setAttribute("src", "https://giscus.app/client.js");
        scriptElement.setAttribute("data-repo", "The-Zagy/zagy-blog");
        scriptElement.setAttribute("data-repo-id", "R_kgDOIXastw");
        scriptElement.setAttribute("data-category", "General");
        scriptElement.setAttribute("data-category-id", "DIC_kwDOIXast84CTi9c");
        scriptElement.setAttribute("data-mapping", "pathname");
        scriptElement.setAttribute("data-reactions-enabled", "1");
        scriptElement.setAttribute("data-emit-metadata", "0");
        scriptElement.setAttribute("data-lang", "en");
        scriptElement.setAttribute("data-theme", theme);
        ref.current?.appendChild(scriptElement);
    }, [theme]);
    return (
        <div ref={ref} />
    )
}
export default Comments;