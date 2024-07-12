import { Link } from "react-router-dom"

export function App() {
  return (
    <>
      <h2>design patterns</h2>
      <ul>
        <li>
          <Link to="/patterns/">patterns index</Link>
        </li>
        <hr />
        <li>
          <Link to="/patterns/singleton">Singleton</Link>
        </li>
        <li>
          <Link to="/patterns/proxy">Proxy</Link>
        </li>
      </ul>
    </>
  )
}

export default App
