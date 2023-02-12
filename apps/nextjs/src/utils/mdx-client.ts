import * as React from 'react'
import * as _jsx_runtime from 'react/jsx-runtime'
import * as ReactDOM from 'react-dom'
// tslint:disable-next-line: strict-export-declare-modifiers
type FunctionComponent<Props> = (props: Props) => JSX.Element | null;
// tslint:disable-next-line: strict-export-declare-modifiers
type ClassComponent<Props> = new (props: Props) => JSX.ElementClass;
// tslint:disable-next-line: strict-export-declare-modifiers
type Component<Props> = FunctionComponent<Props> | ClassComponent<Props>;
// tslint:disable-next-line: strict-export-declare-modifiers
interface NestedMDXComponents {
    [key: string]: NestedMDXComponents | Component<any> | keyof JSX.IntrinsicElements;
}

// Public MDX helper types

/**
 * MDX components may be passed as the `components`.
 *
 * The key is the name of the element to override. The value is the component to render instead.
 */
export type MDXComponents = NestedMDXComponents & {
    [Key in keyof JSX.IntrinsicElements]?: Component<JSX.IntrinsicElements[Key]> | keyof JSX.IntrinsicElements;
} & {
    /**
     * If a wrapper component is defined, the MDX content will be wrapped inside of it.
     */
    wrapper?: Component<any>;
};

export type MDXContentProps = {
    [props: string]: unknown
    components?: MDXComponents
}

/**
 *
 * @param {string} code - The string of code you got from bundleMDX
 * @param {Record<string, unknown>} [globals] - Any variables your MDX needs to have accessible when it runs
 * @return {React.FunctionComponent<MDXContentProps>}
 */
function getMDXComponent(code: string, globals?: Record<string, unknown>): React.FunctionComponent<MDXContentProps> {
    // eslint-disable-next-line
    const mdxExport = getMDXExport(code, globals)
    // eslint-disable-next-line
    return mdxExport.default
}

/**
 * @template ExportedObject
 * @template Frontmatter
 * @type {import('./types').MDXExportFunction<ExportedObject, Frontmatter>}
 * @param {string} code - The string of code you got from bundleMDX
 * @param {Record<string, unknown>} [globals] - Any variables your MDX needs to have accessible when it runs
 *
 */
function getMDXExport(code: string, globals?: Record<string, unknown>) {
    const scope = { React, ReactDOM, _jsx_runtime, ...globals }
    // eslint-disable-next-line
    const fn = new Function(...Object.keys(scope), code)
    // eslint-disable-next-line
    return fn(...Object.values(scope))
}

export { getMDXComponent, getMDXExport }