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
    'smth.top_' + date.getFullYear() + '_' + (date.getMonth() + 1) + '_' + date.getDate() + '.zip'
  )
}
const mainJsonFileName = 'smth.top.json'
const imgUriPrefix = 'https://'
export { getBackupFileName, getBackupTemplate, mainJsonFileName, imgUriPrefix }
export type Backup = { [key in tableName]: tableName2obj<key>[] }
