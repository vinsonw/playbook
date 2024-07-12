import { useEffect, useState } from "react"

export function Proxy() {
  return (
    <>
      <h2>case: show a loading status when img loads </h2>
      {IMG_LIST.map((src) => (
        <ProxyImage key={src} src={src} />
      ))}
      <hr />
      <h2>case: batch network request</h2>
      <BatchNetworkRequests />
      <h2>case: cache calculation result</h2>
      <CachedCalculation />
    </>
  )
}

/**
   case: show a loading status when img loads
 */
const IMG_LIST = [
  "https://images.unsplash.com/photo-1720692393334-c2301df7e0c9?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
] as const

function ProxyImage({ src }: { src: string }) {
  // need to put react.svg at public folder
  const [displayedSrc, setDisplayedSrc] = useState("/loading.gif")

  useEffect(() => {
    const dummyImg = new Image()

    // listen for loading finish
    dummyImg.addEventListener("load", (e) => {
      const img = e.target as HTMLImageElement
      setDisplayedSrc(img.src)
    })

    dummyImg.addEventListener("error", () => {
      console.log("image load failed")
      // show error image when load fails
      setDisplayedSrc("/error.png")
    })

    // start loading
    dummyImg.src = src
  }, [src])

  return <VanillaImage src={displayedSrc} />
}

function VanillaImage({ src }: { src: string }) {
  return (
    <img
      src={src}
      style={{ width: 400, height: "auto", objectFit: "contain" }}
    />
  )
}

/**
      case: batch network requests (virtual proxy)
 */
const syncFile = async ({ checked, id }: { id: string; checked: boolean }) => {
  console.log(`id ${id} checked ${checked}`)
  return { success: true }
}
const proxySyncFile = (() => {
  let batch: any[] = []
  let timer: number | null = null
  const BATCH_TIME = 2 * 1000

  return ({ checked, id }: Parameters<typeof syncFile>["0"]) => {
    batch.push(() => syncFile({ checked, id }))
    if (timer !== null) {
      return
    }
    timer = setTimeout(() => {
      batch.map((fn) => fn())
      timer = null
    }, BATCH_TIME)
  }
})()

function BatchNetworkRequests() {
  return (
    <>
      {Array.from(Array(10).keys()).map((i) => (
        <label key={i}>
          <input
            type="checkbox"
            id={`${i}`}
            onChange={(e) => {
              // syncFile({ id: `${i}`, checked: e.target.checked })
              proxySyncFile({ id: `${i}`, checked: e.target.checked })
            }}
          />
          <span>{i}</span>
        </label>
      ))}
    </>
  )
}

/*
   <h2>case: cache calculation result</h2>
*/
const makeCachedCalculate = (
  fn: (...params: number[]) => number,
  doesOrderOfParamsMatter = false
) => {
  const cache: any = {}
  return (...params: Parameters<typeof fn>) => {
    let stableKey
    if (!doesOrderOfParamsMatter) {
      stableKey = [...params].sort().join(",")
    } else {
      stableKey = params.join(",")
    }
    if (cache[stableKey]) {
      console.log("hit cache with key:", stableKey)
      return cache[stableKey]
    }
    cache[stableKey] = fn(...params)
    return cache[stableKey]
  }
}

const cachedMultiply = makeCachedCalculate((...params: number[]) => {
  return params.reduce((prev, cur) => prev * cur)
})

const cachedDivision = makeCachedCalculate((...params: number[]) => {
  return params.reduce((prev, cur) => prev / cur)
}, true)

function CachedCalculation() {
  const [multiplyRes, setMultiplyRes] = useState(undefined)
  const [divisionRes, setDivisionRes] = useState(undefined)
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const multiplyParams = (formData.get("multiply") as string)
            .split(",")
            .map((str) => +str)
          setMultiplyRes(cachedMultiply(...multiplyParams))
          const divisionParams = (formData.get("division") as string)
            .split(",")
            .map((str) => +str)
          setDivisionRes(cachedDivision(...divisionParams))
        }}
      >
        <label>
          <div>calc multiply res: {multiplyRes}</div>
          <span>input numbers separated by comma</span>
          <input name="multiply" type="text" />
        </label>
        <label>
          <div>calc division res: {divisionRes}</div>
          <span>input numbers separated by comma</span>
          <input name="division" type="text" />
        </label>
        <input type="submit" hidden />
      </form>
    </>
  )
}
