import ExcelJS from 'exceljs'
import { StepResult } from '../../core/automation-engine'

// 엑셀 리포트 출력 전용 어댑터
export class ExcelReportWriter {
  async write(results: StepResult[], outputPath: string): Promise<void> {
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('QA Report')

    sheet.columns = [
      { header: '스텝', key: 'step', width: 8 },
      { header: '테스트 케이스', key: 'desc', width: 30 },
      { header: '결과', key: 'status', width: 10 },
      { header: '소요 시간(ms)', key: 'durationMs', width: 15 },
      { header: '인식 방법', key: 'method', width: 12 },
      { header: '일치율', key: 'confidence', width: 10 },
      { header: '실행 시각', key: 'timestamp', width: 25 },
      { header: '비고', key: 'note', width: 30 }
    ]

    results.forEach((r) => sheet.addRow(r))

    sheet.getRow(1).font = { bold: true }

    await workbook.xlsx.writeFile(outputPath)
  }
}