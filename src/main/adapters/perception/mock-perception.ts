import { PerceptionPort, ScreenResult } from '../../ports/perception-port'

// 가짜 화면 인식 어댑터: 기기 없이 core를 테스트하기 위한 구현
export class MockPerception implements PerceptionPort {
  async getScreen(): Promise<ScreenResult> {
    return {
      screenshot: Buffer.from('fake-image-data'),
      elements: [
        {
          label: 'guest_login',
          bbox: [900, 850, 200, 80],
          confidence: 0.99,
          method: 'template'
        }
      ]
    }
  }
}