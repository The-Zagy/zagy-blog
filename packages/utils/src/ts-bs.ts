export type AsyncReturnType<T extends (...args: any) => Promise<any>> = // eslint-disable-line
    T extends (...args: any) => Promise<infer R> ? R : any;  // eslint-disable-line