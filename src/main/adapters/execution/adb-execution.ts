import { exec } from 'child_process'
import { promisify } from 'util'
import { ExecutionPort, Action, ActionResult } from '../../ports/execution-port'

const execAsync = promisify(exec)

// ADB 기반 실행 어댑터: adb shell input 명령으로 실제 기기 제어
export class AdbExecution implements ExecutionPort {
  async executeAction(action: Action): Promise<ActionResult> {
    const command = this.buildCommand(action)

    if (!command) {
      return { success: false, error: `지원하지 않는 액션 타입: ${action.type}` }
    }

    try {
      await execAsync(command)
      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: `ADB 명령 실패: ${message}` }
    }
  }

  // 액션 타입에 맞는 adb 명령 문자열 생성
  private buildCommand(action: Action): string | null {
    switch (action.type) {
      case 'tap':
        return `adb shell input tap ${action.x} ${action.y}`
      case 'swipe':
        return `adb shell input swipe ${action.x} ${action.y} ${action.x2} ${action.y2} 300`
      case 'key':
        return `adb shell input keyevent ${action.key}`
      default:
        return null
    }
  }
}