import Spark from "spark-md5"

export async function createChunk(file:File, index: number , chunkSize: number) {
  return new Promise((resolve) => {
    const start = index * chunkSize
    const end = start + chunkSize
    const fileReader = new FileReader()
    const spark = new Spark()
    fileReader.onload = (e) => {
      spark.append(e.target!.result as string)
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
