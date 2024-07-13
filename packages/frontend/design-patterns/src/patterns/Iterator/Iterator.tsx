import { useEffect, useState } from "react"

const EMULATED_DEFAULT_ENV = "firefox" as const

export function Iterator() {
  const [emulatedEnv, _] = useState<
    "chrome" | "firefox" | "safari" | (string & {})
  >(EMULATED_DEFAULT_ENV)

  useEffect(() => {
    document.body.dataset.emulatedEnv = EMULATED_DEFAULT_ENV
  }, [])

  return (
    <>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2em",
          width: 200,
        }}
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const toUploadFile = formData.get("upload-content")
          getUploadFn()(toUploadFile)
        }}
      >
        <div>
          <label htmlFor="emulated-env">
            emulated env(the browser the page is open in)
          </label>
          <input
            type="text"
            id="emulated-env"
            name="emulated-env"
            value={emulatedEnv}
            disabled
          />
        </div>
        <div>
          <label htmlFor="upload-content">upload content</label>
          <input type="file" id="upload-content" name="upload-content" />
        </div>
        <button>upload</button>
      </form>
    </>
  )
}

function getUploadFn() {
  return iteratorUploadFn(
    uploadFnForChrome,
    uploadFnForFirefox,
    uploadFnForSafari
  )
}

let cachedTargetFn: any = null
function iteratorUploadFn(...uploadFnList: (() => false | Function)[]) {
  if (cachedTargetFn) return cachedTargetFn
  for (const fn of uploadFnList) {
    const targetFn = fn()
    if (targetFn !== false) {
      return (cachedTargetFn = targetFn)
    }
  }

  return (cachedTargetFn = () => {
    throw new Error("no upload fn available")
  })
}

function uploadFnForChrome() {
  try {
    if (document.body.dataset.emulatedEnv === "chrome") {
      return (uploadContent: string) => {
        console.log("uploading using uploadFnForChrome", uploadContent)
      }
    }
    throw new Error("env not match")
  } catch (e) {
    return false
  }
}

function uploadFnForFirefox() {
  try {
    if (document.body.dataset.emulatedEnv === "firefox") {
      return (uploadContent: string) => {
        console.log("uploading using uploadFnForFirefox", uploadContent)
      }
    }
    throw new Error("env not match")
  } catch (e) {
    return false
  }
}

function uploadFnForSafari() {
  try {
    if (document.body.dataset.emulatedEnv === "safari") {
      return (uploadContent: string) => {
        console.log("uploading using uploadFnForSafari", uploadContent)
      }
    }
    throw new Error("env not match")
  } catch (e) {
    return false
  }
}
