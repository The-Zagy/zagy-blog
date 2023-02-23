# Contribution Guidelines

When contributing to **zagy-blog**, whether on GitHub or in other community spaces:

- Be respectful, civil, and open-minded.
- Before opening a new pull request, try searching through the issue tracker for known issues or fixes.
- If you want to make code changes based on your personal opinion(s), make sure you open an issue first describing the changes you want to make, and open a pull request only when your suggestions get approved by maintainers.

## Contribute TO The Blog Content

1- [fork the repo](https://github.com/The-Zagy/zagy-blog/fork).

2- add your content as "MDX" in [content/blog](./content/blog/).

3- check [mdx rules in the next section](#mdx-filefolder-rules).

4- Pull Request with your changes.

## MDX file/folder Rules

- you can provide **mdx file** or **folder** contains mdx file called `index.mdx` with your custom react components.

- the *mdx file* ***MUST*** start with meta data about the blog post here's an example

> Note **categories** is optional BUT it's recommended baby

``` mdx
---
title: my zagy blog post 
date: 2023-03-20
description:
  here i descripe my blog post it will be shown in different places
categories:
  - my optional category
meta:
  keywords:
    - my seo meta keywords
bannerUrl: https://my_banner_link.png
---
```

Thank You for Your Contribution
