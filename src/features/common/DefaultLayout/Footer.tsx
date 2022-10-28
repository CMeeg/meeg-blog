import { GithubIcon, TwitterIcon } from '~/svg/icons'
import styles from './footer.module.scss'

export interface Props {
  copyright?: string
  gitHubUsername?: string
  twitterUsername?: string
}

export default function Footer({
  copyright,
  gitHubUsername,
  twitterUsername
}: Props) {
  const currentYear = new Date().getFullYear()

  const githubUrl = gitHubUsername
    ? `https://github.com/${gitHubUsername}`
    : null

  const twitterUrl = twitterUsername
    ? `https://twitter.com/${twitterUsername}`
    : null

  const hasLinks = githubUrl || twitterUrl

  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        {copyright ?? 'Chris Meagher'} &copy; {currentYear}
      </p>
      {hasLinks && (
        <ul className={styles['icon-links']}>
          {githubUrl && (
            <li>
              <a href={githubUrl}>
                <GithubIcon className={styles.icon} />{' '}
                <span className="visually-hidden">GitHub</span>
              </a>
            </li>
          )}
          {twitterUrl && (
            <li>
              <a href={twitterUrl}>
                <TwitterIcon className={styles.icon} />{' '}
                <span className="visually-hidden">Twitter</span>
              </a>
            </li>
          )}
        </ul>
      )}
    </footer>
  )
}
