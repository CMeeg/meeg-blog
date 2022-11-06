const getTagUrl = (tag: string) => {
  return `/tags/${encodeURIComponent(tag)}`
}

export { getTagUrl }
