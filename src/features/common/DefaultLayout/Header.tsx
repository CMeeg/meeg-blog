import type {
  AssetStoryblok,
  NavItemStoryblok
} from '~/features/storyblok/types/components'
import Image from '~/features/common/Image'
import Link from '~/features/common/Link'
import { getImageFromAsset } from '../media'

export interface Props {
  logo: AssetStoryblok
  mainNav: NavItemStoryblok[]
}

export default function Header({ logo, mainNav }: Props) {
  const image = getImageFromAsset(logo, { resize: { width: 100 }, quality: 80 })

  return (
    <header>
      <Image image={image} />

      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>

          {mainNav.map((item) => {
            return (
              <li key={item._uid}>
                <Link link={item.link}>{item.name}</Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
