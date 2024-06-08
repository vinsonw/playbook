import { useEffect, useRef, useState } from "react"
import { useVirtualList } from "ahooks"


const loadMore = (): Promise<number[]> => {
  console.log('===> start loading more')
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Array.from(Array(100).keys()))
    }, 300)
  })
}

export const VirtualListDemo = () => {
  const [completeList, setCompleteList] = useState(Array.from(Array(100).keys()))
  const [isLoading, setIsLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const ITEM_HEIGHT = 25
  const CONTAINER_HEIGHT = 200
  const DISTANCE = 100

  const [renderedList] = useVirtualList(completeList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: ITEM_HEIGHT,
  })

  const handleScroll = () => {
    const scrollTop = containerRef.current!.scrollTop
    console.log('scrolling', scrollTop, 'list.length', completeList.length)
    if (scrollTop + CONTAINER_HEIGHT > completeList.length * ITEM_HEIGHT - DISTANCE) {
      setIsLoading(true)
    }
  }

  useEffect(() => {
    if (isLoading) {
      loadMore().then(res => {
        setCompleteList(() => completeList.concat(res))
        setIsLoading(false)
      })
    }
  }, [isLoading])

  return (
    <div
      ref={containerRef}
      className="container"
      onScroll={handleScroll}
      style={{
        height: 200,
        overflow: "auto",
        border: "1px solid black",
      }}
    >
      <div ref={wrapperRef} className="wrapper">
        {renderedList.map((item) => (
          <div style={{height: 25}} key={item.data}>item: {item.index + ":" + item.data}</div>
        ))}
      </div>
      {
        isLoading && <h2>loading</h2>
      }
    </div>
  )
}
