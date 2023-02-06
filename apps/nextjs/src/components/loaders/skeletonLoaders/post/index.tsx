import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import ContentLoader, { IContentLoaderProps } from 'react-content-loader'

const PostSkeletonLoader: React.FC<IContentLoaderProps> = (props) => {
    let theme: string | undefined = "dark";
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);
    const temp = useTheme();
    if (isMounted) {
        theme = temp.theme;
    }
    const bgColor = theme === "dark" ? "#424242" : "#f0f0f0";
    const fgColor = theme === "dark" ? "#454444" : "#dedede";
    return (
        <ContentLoader
            className='w-full h-96'
            backgroundColor={bgColor}
            foregroundColor={fgColor}
            {...props}


        >
            <rect x="0" y="365" rx="4" ry="4" width="260" height="9" />
            <rect x="0" y="377" rx="4" ry="4" width="130" height="9" />
            <rect x="0" y="0" rx="10" ry="10" width="300" height="355" />
        </ContentLoader>
    )
}



export default PostSkeletonLoader