// 실행 포트: 실행 방법(ADB 등)과 무관하게 규격만 정의

// 실행할 동작
export interface Action {
  type: 'tap' | 'swipe' | 'key'
  x?: number
  y?: number
  x2?: number
  y2?: number
  key?: string
}

// 동작 실행 결과
export interface ActionResult {
  success: boolean
  error?: string
}

// 실행 포트 규격
export interface ExecutionPort {
  executeAction(action: Action): Promise<ActionResult>
}