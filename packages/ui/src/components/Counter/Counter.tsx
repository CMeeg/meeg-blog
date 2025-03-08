import { useState } from "react"

interface CounterProps {
  startAt?: number
}

function Counter({ startAt }: CounterProps) {
  const [count, setCount] = useState(startAt ?? 0)

  return (
    <button type="button" onClick={() => setCount((count) => count + 1)}>
      count is {count}
    </button>
  )
}

export { Counter }
