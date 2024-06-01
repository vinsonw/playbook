import { createChunk } from './helper'

onmessage = async (e) => {
  const { file , CHUNK_SIZE, startChunkIndex, endChunkIndex } = e.data
  // console.log('worker',  file , CHUNK_SIZE, startChunkIndex, endChunkIndex )

  const pendingResults = []
  for (let i = startChunkIndex; i < endChunkIndex; i++) {
    pendingResults.push(createChunk(file, i, CHUNK_SIZE))
  }
  const results = await Promise.all(pendingResults)
  // console.log('this worker results: ', results)
  postMessage(results)
}
