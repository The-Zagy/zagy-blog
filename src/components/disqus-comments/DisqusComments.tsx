
import Script from "next/script"

import React from "react"
import { env } from "../../env/client.mjs";
const DisqusComments: React.FC<{ pageUrl: string, pageId: string }> = ({ pageUrl, pageId }) => {
    //todo add baseUrl and try to figure out a way to make it work on local
    return (
        <>
            <div id="disqus_thread" className="w-5/6 m-auto"></div>
            <Script id="comments" strategy="lazyOnload" >{`
   
    ${env.NEXT_PUBLIC_ENV === "development" ? "var disqus_developer = 1;" : " "}
    var disqus_config = function () {
    this.page.url = "${"baseUrl"}/${pageUrl}"; 
    this.page.identifier = "${pageId}"; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
  
    (function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://zagy.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();
        `}</Script>

        </>
    )
}
export default DisqusComments;