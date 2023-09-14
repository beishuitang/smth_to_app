import config from '@/scripts/smthScriptConfig'
import type { tableName, tableName2obj } from '@/storage/tableInfo'
function getBackupTemplate(): Backup {
  return {
    articleTable: [],
    tagTable: [],
    imgTable: [],
    topicTable: [],
    ipTable: [],
    majiaTable: [],
    likeTable: [],
    stateTable: [],
    cachedMajiaTable: [],
    cachedTagTable: []
  }
}

function getBackupFileName() {
  const date = new Date()
  return (
    config.PROJECT_NAME +
    date.getFullYear() +
    '_' +
    (date.getMonth() + 1) +
    '_' +
    date.getDate() +
    '.zip'
  )
}
const mainJsonFileName = config.PROJECT_NAME + '.json'
const imgUriPrefix = 'https://'
export { getBackupFileName, getBackupTemplate, mainJsonFileName, imgUriPrefix }
export type Backup = { [key in tableName]: tableName2obj<key>[] }
