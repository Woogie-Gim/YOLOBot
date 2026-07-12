import { exec } from 'child_process'
import { PerceptionPort, ScreenResult } from '../../ports/perception-port'

// ADB 기반 화면 인식 어댑터 (현재는 캡처까지만 구현, 매칭은 추후)
export class AdbPerception implements PerceptionPort {
  async getScreen(): Promise<ScreenResult> {
    const screenshot = await this.capture()

    // 매칭은 아직 미구현: 캡처한 이미지만 담고 요소 목록은 비워둠
    return {
      screenshot,
      elements: []
    }
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
}