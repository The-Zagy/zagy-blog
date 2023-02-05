import React from 'react'
import ContentLoader, { IContentLoaderProps } from 'react-content-loader'

const PostSkeletonLoader: React.FC<IContentLoaderProps> = (props) => (
    <ContentLoader
        className='w-full h-96'
        backgroundColor="#f0f0f0"
        foregroundColor="#dedede"
        {...props}


    >
        <rect x="0" y="365" rx="4" ry="4" width="260" height="9" />
        <rect x="0" y="377" rx="4" ry="4" width="130" height="9" />
        <rect x="0" y="0" rx="10" ry="10" width="300" height="355" />
    </ContentLoader>
)



export default PostSkeletonLoader