const inputEl = document.querySelector("input[type=file]") as HTMLInputElement

const CHUNK_SIZE = 1024 * 1024 * 5
const THREAD_COUNT = navigator.hardwareConcurrency || 4

inputEl.onchange = async (e: any) => {
  const file = e.target.files[0]
  if (!file) {
    console.warn('not selecting file')
    return
  }
  console.log('start processing:', file)
  const start = Date.now()
  const res = await sliceFile(file)
  console.log('Time elapsed:', Date.now() - start, ` ${THREAD_COUNT} workers used`)
  console.log('slicing res:', res)
}


async function sliceFile(file: File) {
  return new Promise((resolve) => {
    const result: any[] = []
    let finishWorkerCount = 0
    // ceil, not floor
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE)
    const eachWorkerAssignedChunkCount = Math.ceil(chunkCount / THREAD_COUNT)
    let workingWorkerCount = 0
    for (let i = 0; i < THREAD_COUNT; i++) {
      const worker = new Worker(new URL('./worker.ts', import.meta.url), {
        // !it must be set 'module' if 'worker.ts' needs to use import syntax
        type: 'module'
      })
      const startChunkIndex = i * eachWorkerAssignedChunkCount
      if (startChunkIndex > chunkCount - 1) return
      workingWorkerCount++
      let endChunkIndex = startChunkIndex + eachWorkerAssignedChunkCount
      // for each worker, it gets: [startChunkIndex, endChunkIndex)
      // endChunkIndex is not read 
      if (endChunkIndex > chunkCount) endChunkIndex = chunkCount
      worker.postMessage({
        file,
        CHUNK_SIZE,
        startChunkIndex,
        endChunkIndex,
      })
      worker.onerror = ((err) => {
        console.error(err.message)
        throw err.error
      }) 
      worker.onmessage = (e) => {
        for (let i = startChunkIndex; i < endChunkIndex; i++) {
          result[i] = e.data[i - startChunkIndex]
        }
        // console.log('got res:', result)
        worker.terminate()
        finishWorkerCount++
        if (finishWorkerCount === workingWorkerCount) {
          resolve(result)
        }
      }
    }
  })
}
