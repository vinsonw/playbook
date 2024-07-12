import { Link, Outlet } from "react-router-dom"

export const PatternLayout = () => {
  return (
    <>
      <header>
        <div style={{ margin: "20px" }}>
          <Link to="/">back home</Link>
        </div>
      </header>
      <Outlet />
    </>
  )
}
