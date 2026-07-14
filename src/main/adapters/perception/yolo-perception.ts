import { exec } from 'child_process'
import { PerceptionPort, ScreenResult, DetectedElement } from '../../ports/perception-port'

const INFERENCE_URL = 'http://127.0.0.1:8756/infer'

// YOLO 추론 서비스와 HTTP로 통신하는 화면 인식 어댑터
export class YoloPerception implements PerceptionPort {
  async getScreen(): Promise<ScreenResult> {
    const screenshot = await this.capture()
    const elements = await this.infer(screenshot)

    return { screenshot, elements }
  }

  // adb exec-out screencap으로 화면을 캡처해 PNG 버퍼로 반환
  private capture(): Promise<Buffer> {
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

  // 캡처 이미지를 추론 서비스로 보내고 탐지 결과를 받음
  private async infer(screenshot: Buffer): Promise<DetectedElement[]> {
    const imageBase64 = screenshot.toString('base64')

    const response = await fetch(INFERENCE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 })
    })

    if (!response.ok) {
      throw new Error(`추론 서비스 응답 오류: ${response.status}`)
    }

    const data = await response.json()
    return data.elements as DetectedElement[]
  }
}