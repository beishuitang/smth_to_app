export interface Article {
  articleUri: string
  content: string[]
  id: string
  t: number //modify timestamp
  u?: number //storage timestamp
  tags: { [key: string]: number }
}
