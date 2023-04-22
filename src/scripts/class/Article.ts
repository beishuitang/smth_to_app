export interface Article {
  articleUri: string
  content: string[]
  id: string
  t: number
  tags: { [key: string]: number }
}
