// import type { Article } from '@/interface/Article'
export type DataOnly<T> = T extends T
  ? Pick<
      T,
      {
        [K in keyof T]: T[K] extends Function ? never : K
      }[keyof T]
    >
  : never
// type s = DataOnly<Article>
