# Express

## why another app??????????????

because we're poor bro stop asking, we were using nextjs for everything but with our dependence on "on demand revalidation" for nextjs we faced problem that we need to parse the new data coming from github each time then add them to the database, all good for now but as i said before we're poor students so we're using vercel free tier that give us 10s for computation in serverless environemt and with free tier for the database we need more time, so we needed to get out of vercel constraints and go else where for this task

## end points

- '/'

- '/revalidate'

- '/seed'

### Revalidation Rules

1. if the modified file is from the base dir which is "content/blog"

    1. modified => insert into the filter with true[means will get downloaded from github]

    2. added => insert into the filter with true[means will get downloaded from github]

    3. deleted => be falsy in the filter hash or don't insert it at all [and only will be deleted from the database]

2. if the file/folder is not in the base dir [in sub dir like "content/blog/mypost/"]

    1. added any file => insert the dir name in the hash which for example would be "content/blog/myPost"[download the dir from github]

    2. modified any file => insert the dir name in the hash which for example would be "content/blog/myPost"[download the dir from github]

    3. deleted the "index.mdx" => add the folder path to the hash as falsy[supposed to be deleted from the database only]

    4. deleted other file like component for example => insert in the hash the "dir name" [download the dir from github]

> NOTE after those operation express app call nextjs to let it update the cache

## todo

-[]
