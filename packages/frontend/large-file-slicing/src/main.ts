import axios from "axios"
import { createChunk } from "./helper"

const slicingInputEl = document.querySelector(
  "input#slicing-upload"
) as HTMLInputElement

const CHUNK_SIZE = 1024 * 1024 * 5
const THREAD_COUNT = navigator.hardwareConcurrency || 4

slicingInputEl.onchange = async (e: any) => {
  const file = e.target.files[0]
  if (!file) {
    console.warn("not selecting file")
    return
  }
  console.log("start processing:", file)
  const start = Date.now()
  const chunkList = await sliceFile(file)
  console.log(
    "Time elapsed:",
    Date.now() - start,
    ` ${THREAD_COUNT} workers used`
  )
  console.log("1. slicing res:", chunkList)
  const taskList = chunkList.map((chunk) => {
    const data = new FormData()
    data.set("name", `${chunk.name}`)
    data.set("index", `${chunk.index}`)
    data.append("file", chunk.slice)
    return axios.post("/api/contact/upload", data)
  })
  const res = await Promise.all(taskList)
  console.log("2. upload res", res)
  const mergeRes = await axios.get(`api/contact/merge?name=${file.name}`)
  console.log("3. merge res", mergeRes)
}

type ChunkList = Awaited<ReturnType<typeof createChunk>>[]

async function sliceFile(file: File): Promise<ChunkList> {
  return new Promise((resolve) => {
    const result: any[] = []
    let finishWorkerCount = 0
    // ceil, not floor
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE)
    const eachWorkerAssignedChunkCount = Math.ceil(chunkCount / THREAD_COUNT)
    let workingWorkerCount = 0
    for (let i = 0; i < THREAD_COUNT; i++) {
      const worker = new Worker(new URL("./worker.ts", import.meta.url), {
        // !it must be set 'module' if 'worker.ts' needs to use import syntax
        type: "module",
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
      worker.onerror = (err) => {
        console.error(err.message)
        throw err.error
      }
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

/*
    multipart/form-data
  */
const inputEl = document.querySelector("#upload") as HTMLInputElement
inputEl.addEventListener("change", () => {
  if (!inputEl.files) return
  const data = new FormData()
  data.set("name", "vinson")
  data.set("age", "18")
  for (let i = 0; i < inputEl.files.length; i++) {
    data.set("file" + i, inputEl.files[0])
  }
  axios
    .post("/api/contact/upload", data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log("upload res: ", res)
    })
})
