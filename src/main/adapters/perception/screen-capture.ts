import { exec } from 'child_process'

// adb exec-out screencap으로 화면을 캡처해 PNG 버퍼로 반환
export function captureScreen(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    exec('adb exec-out screencap -p', { encoding: 'buffer', maxBuffer: 50 * 1024 * 1024 },
      (error, stdout) => {
        if (error) {
          reject(new Error(`화면 캡처 실패: ${error.message}`))
          return
        }
        resolve(stdout as Buffer)
      }
    )
  })
}