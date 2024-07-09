import Spark from "spark-md5"

export async function createChunk(
  file: File,
  index: number,
  chunkSize: number
): Promise<{
  start: number
  end: number
  index: number
  hash: string
  slice: Blob
  name: string
}> {
  return new Promise((resolve) => {
    const start = index * chunkSize
    const end = start + chunkSize
    const fileReader = new FileReader()
    // the constructor used here has to match below FileReader.result
    const spark = new Spark.ArrayBuffer()
    const slice = file.slice(start, end)
    fileReader.onload = (e) => {
      spark.append(e.target!.result as ArrayBuffer)
      resolve({
        start,
        end,
        index,
        hash: spark.end(),
        slice,
        name: file.name
      })
    }

    fileReader.readAsArrayBuffer(slice)
  })
}
