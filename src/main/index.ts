import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { mkdirSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { AutomationEngine, ScenarioStep } from './core/automation-engine'
import { MockPerception } from './adapters/perception/mock-perception'
import { MockExecution } from './adapters/execution/mock-execution'
import { ExcelReportWriter } from './adapters/reporting/excel-report-writer'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  runTestScenario()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 시나리오 JSON을 읽어 mock 어댑터로 실행 (임시 검증용)
async function runTestScenario() {
  const perception = new MockPerception()
  const execution = new MockExecution()
  const engine = new AutomationEngine(perception, execution)

  const scenarioPath = join(app.getAppPath(), 'config', 'scenarios', 'test-scenario.json')
  const scenarioData = readFileSync(scenarioPath, 'utf-8')
  const steps: ScenarioStep[] = JSON.parse(scenarioData)

  console.log(`[시나리오 시작] 총 ${steps.length}개 스텝`)

  const results = await engine.runScenario(steps)

  console.log('[시나리오 완료]')
  results.forEach((r) => {
    console.log(`  Step ${r.step}: ${r.status} - ${r.desc} (${r.note})`)
  })

  const reportDir = join(app.getAppPath(), 'reports')

  if (!existsSync(reportDir)) {
    mkdirSync(reportDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportPath = join(reportDir, `QA_Report_${timestamp}.xlsx`)

  const writer = new ExcelReportWriter()
  await writer.write(results, reportPath)

  console.log(`[리포트 저장 완료] ${reportPath}`)
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
