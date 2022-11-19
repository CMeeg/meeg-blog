import { useEffect } from 'preact/hooks'
import { loadStoryblokBridge } from '@storyblok/js'

export default function StoryblokBridge() {
  useEffect(() => {
    loadStoryblokBridge().then(() => {
      const { StoryblokBridge, location } = window
      const storyblokInstance = new StoryblokBridge()

      storyblokInstance.on(['published', 'change'], (event) => {
        if (!event?.slugChanged) {
          location.reload()
        }
      })
    })
  }, [])

  return <></>
}
