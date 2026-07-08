import { ExecutionPort, Action, ActionResult } from '../../ports/execution-port'

// 가짜 실행 어댑터: 기기 없이 core를 테스트하기 위한 구현
export class MockExecution implements ExecutionPort {
  async executeAction(action: Action): Promise<ActionResult> {
    console.log(`[MockExecution] 가짜 실행: ${action.type} (${action.x}, ${action.y})`)
    return {
      success: true
    }
  }
}