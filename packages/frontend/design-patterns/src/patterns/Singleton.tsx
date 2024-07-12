import { useEffect } from "react"

/**
 *
 * @description make lazy singleton
 */
const makeCreateRootDom = () => {
  let createdRootDom: HTMLDivElement | null = null
  const cleanup = () => {
    createdRootDom?.remove()
    createdRootDom = null
  }
  const create = () => {
    if (createdRootDom) {
      window.alert("Root already created")
      return createdRootDom
    }

    createdRootDom = document.createElement("div")
    createdRootDom.style.width = "100px"
    createdRootDom.style.height = "100px"
    createdRootDom.style.backgroundColor = "lightblue"
    createdRootDom.textContent = Math.random().toString().slice(2, 8)
    document.body.appendChild(createdRootDom)

    return createdRootDom
  }
  return {
    create,
    cleanup,
  }
}

const { create, cleanup } = makeCreateRootDom()

export function Singleton() {
  useEffect(() => cleanup, [])

  return (
    <>
      <button onClick={create}>create root</button>
    </>
  )
}
