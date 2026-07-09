import { PerceptionPort } from '../ports/perception-port'
import { ExecutionPort, Action } from '../ports/execution-port'

// 시나리오 스텝 하나
export interface ScenarioStep {
  step: number
  desc: string
  targetLabel: string
  action: Action
  postDelay: number
}

// 스텝 실행 결과 기록
export interface StepResult {
  step: number
  desc: string
  status: 'PASS' | 'FAIL'
  note: string
}

// 자동화 지휘자: 포트만 참조하며 인식/실행 구현은 모름
export class AutomationEngine {
  constructor(
    private perception: PerceptionPort,
    private execution: ExecutionPort
  ) {}

  // 시나리오 스텝 하나를 실행하고 결과를 반환
  async runStep(step: ScenarioStep): Promise<StepResult> {
    // 화면을 인식 (어떻게 하는지는 모름)
    const screen = await this.perception.getScreen()

    // 목표 요소를 찾음
    const target = screen.elements.find((el) => el.label === step.targetLabel)

    // 못 찾으면 실패로 기록하고 진행 (멈추지 않음)
    if (!target) {
      return {
        step: step.step,
        desc: step.desc,
        status: 'FAIL',
        note: '화면에서 목표 요소를 찾지 못함'
      }
    }

    // 동작을 실행 (어떻게 하는지는 모름)
    const result = await this.execution.executeAction(step.action)

    // 실행 결과를 기록으로 반환
    return {
      step: step.step,
      desc: step.desc,
      status: result.success ? 'PASS' : 'FAIL',
      note: result.success ? '정상 실행' : (result.error ?? '실행 실패')
    }
  }

   // 시나리오 전체를 순서대로 실행하고 모든 결과를 반환
  async runScenario(steps: ScenarioStep[]): Promise<StepResult[]> {
    const results: StepResult[] = []

    for (const step of steps) {
      const result = await this.runStep(step)
      results.push(result)

      await this.delay(step.postDelay * 1000)
    }

    return results
  }

  // 지정한 밀리초만큼 대기
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}