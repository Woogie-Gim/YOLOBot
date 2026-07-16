import { captureScreen } from './screen-capture'
import { PerceptionPort, ScreenResult, DetectedElement } from '../../ports/perception-port'

const INFERENCE_URL = 'http://127.0.0.1:8756/infer'

// YOLO 추론 서비스와 HTTP로 통신하는 화면 인식 어댑터
export class YoloPerception implements PerceptionPort {
  async getScreen(): Promise<ScreenResult> {
    try {
      const screenshot = await captureScreen()
      const elements = await this.infer(screenshot)
      return { screenshot, elements }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`[인식 실패] ${message}`)
      return { screenshot: Buffer.alloc(0), elements: [] }
    }
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