import type { BlockComponentProps } from './Block'
import Block from './Block'

export interface Props {
  bloks?: BlockComponentProps[]
}

export default function Blocks({ bloks }: Props) {
  if (!bloks) {
    return null
  }

  return (
    <>
      {bloks.map((blok) => {
        return <Block blok={blok} key={blok._uid} />
      })}
    </>
  )
}
