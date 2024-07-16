const MyWebSocket = require("./ws")
const ws = new MyWebSocket({ port: 8080 })

const timerList = []
ws.on("data", (data) => {
  console.log("receive data:" + data)
  const timer = setInterval(() => {
    ws.send(data + " " + Date.now())
  }, 2000)
  timerList.push(timer)
})

ws.on("close", (code, reason) => {
  console.log("close:", code, reason)
  timerList.forEach((timer) => clearInterval(timer))
})
