module.exports = {
  siteName: 'meeg.dev',
  siteUrl: 'https://meeg.dev',
  siteTwitterUser: 'cmeeg',
  siteGitHubUser: 'cmeeg',
  titleTemplate: '%s - Chris Meagher',
  getSiteUrl(path) {
    const siteUrl = 'https://meeg.dev';
    const url = new URL(siteUrl);

    url.pathname = path;

    return url.href;
  }
}
