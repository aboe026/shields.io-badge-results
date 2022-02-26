import fs from 'fs-extra'
import path from 'path'

export default class E2eConfig {
  static readonly DIRECTORY = {
    Temp: path.join(__dirname, '../.temp-work-dir'),
  }
  static readonly FILE = {
    Debug: path.join(E2eConfig.DIRECTORY.Temp, 'e2e-debug.txt'),
  }

  static async appendToDebugLog(words: string): Promise<void> {
    await fs.appendFile(E2eConfig.FILE.Debug, `${words}\n`)
  }
}
