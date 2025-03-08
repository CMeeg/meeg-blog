import { Counter as CounterButton } from "@phoriaexamples/ui"
import reactLogo from "/react.svg"
import css from "./Counter.module.css"

interface CounterProps {
  startAt?: number
}

function Counter({ startAt }: CounterProps) {
  return (
    <div className={`react-counter ${css.counter}`}>
      <a href="https://react.dev" target="_blank" rel="noreferrer">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <CounterButton startAt={startAt} />
      <p>
        Edit <code>ui/src/components/Counter/Counter.tsx</code> to test HMR
      </p>
    </div>
  )
}

export { Counter }
