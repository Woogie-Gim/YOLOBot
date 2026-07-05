// 화면 인식 포트: 인식 방법(OpenCV/YOLO 등)과 무관하게 규격만 정의

// 화면 인식 결과
export interface ScreenResult {
  screenshot: Buffer
  elements: DetectedElement[]
}

// 화면에서 찾은 요소 하나
export interface DetectedElement {
  label: string
  bbox: [number, number, number, number]
  confidence: number
  method: 'template' | 'yolo' | 'vlm'
}

// 화면 인식 포트 규격
export interface PerceptionPort {
  getScreen(): Promise<ScreenResult>
}