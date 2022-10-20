import type {
  AssetStoryblok,
  NavItemStoryblok
} from '@features/storyblok/types/components'
import Image from '@features/common/Image'
import Link from '@features/common/Link'

export interface Props {
  logo: AssetStoryblok
  mainNav: NavItemStoryblok[]
}

export default function Header({ logo, mainNav }: Props) {
  return (
    <header>
      <Image asset={logo} />

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
