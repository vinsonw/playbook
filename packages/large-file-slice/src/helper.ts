import Spark from "spark-md5"

export async function createChunk(file:File, index: number , chunkSize: number) {
  return new Promise((resolve) => {
    const start = index * chunkSize
    const end = start + chunkSize
    const fileReader = new FileReader()
    // the constructor used here has to match below FileReader.result
    const spark = new Spark.ArrayBuffer()
    fileReader.onload = (e) => {
      spark.append(e.target!.result as ArrayBuffer)
      resolve({
        start,
        end,
        index,
        hash: spark.end(),
      })
    }

    fileReader.readAsArrayBuffer(file.slice(start, end))
  })
}
