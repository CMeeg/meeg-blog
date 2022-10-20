import type { PageStory } from '@features/common/api'
import Blocks from '@features/common/Blocks'

export interface Props {
  story: PageStory
}

export default function Page({ story }: Props) {
  return <Blocks bloks={story.content.body} />
}
