import type { BlockComponent } from './Block'
import Block from './Block'

export interface Props {
  bloks?: BlockComponent[]
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
