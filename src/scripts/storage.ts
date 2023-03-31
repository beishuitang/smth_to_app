import type { UserData } from './class/UserData'
import type { Article } from './class/Article'
import type { Topic } from './class/Topic'

class Storage {
  DB!: IDBDatabase
  userTableName = 'user'
  articleTableName = 'article'
  topicTableName = 'topic'
  initDB = () => {
    return new Promise<void>((resolve, reject) => {
      const idbOpenRequest = indexedDB.open('newsmthScriptDatabase')
      idbOpenRequest.onerror = () => {
        reject('failed to open indexedDB')
      }
      idbOpenRequest.onsuccess = () => {
        this.DB = idbOpenRequest.result
        resolve()
      }
      idbOpenRequest.onupgradeneeded = (event) => {
        this.DB = (event.target as IDBOpenDBRequest).result
        if (!this.DB.objectStoreNames.contains(this.userTableName)) {
          this.DB.createObjectStore(this.userTableName, { keyPath: 'id' })
        }
        if (!this.DB.objectStoreNames.contains(this.articleTableName)) {
          this.DB.createObjectStore(this.articleTableName, { keyPath: 'articleUri' })
        }
        if (!this.DB.objectStoreNames.contains(this.topicTableName)) {
          this.DB.createObjectStore(this.topicTableName, { keyPath: 'topicUri' })
        }
      }
    })
  }
  saveUserData = (userData: UserData) => {
    return new Promise((resolve, reject) => {
      const idbRequest = this.DB.transaction([this.userTableName], 'readwrite')
        .objectStore(this.userTableName)
        .put(userData)
      idbRequest.onsuccess = resolve
      idbRequest.onerror = reject
    })
  }
  saveAllUserData = (usersData: UserData[]) => {
    //TODO
    const idbRequest = this.DB.transaction([this.userTableName], 'readwrite').objectStore(
      this.userTableName
    )
    usersData.forEach((userData) => {
      idbRequest.put(userData)
    })
  }
  getUserDataById = (id: string) => {
    return new Promise<UserData | undefined>((resolve, reject) => {
      const idbRequest = this.DB.transaction([this.userTableName])
        .objectStore(this.userTableName)
        .get(id)
      idbRequest.onsuccess = function () {
        resolve(idbRequest.result)
      }
      idbRequest.onerror = function () {
        reject('failed to get userData')
      }
    })
  }
  getAllUserData = () => {
    return new Promise<UserData[]>((resolve, reject) => {
      const idbRequest: IDBRequest<UserData[]> = this.DB.transaction(this.userTableName)
        .objectStore(this.userTableName)
        .getAll()
      idbRequest.onsuccess = function () {
        resolve(idbRequest.result)
      }
      idbRequest.onerror = function () {
        reject('failed to get userData')
      }
    })
  }
  saveArticle = (article: Article) => {
    return new Promise((resolve, reject) => {
      const idbRequest = this.DB.transaction([this.articleTableName], 'readwrite')
        .objectStore(this.articleTableName)
        .put(article)
      idbRequest.onsuccess = resolve
      idbRequest.onerror = reject
    })
  }
  saveAllArticle = (articles: Article[]) => {
    const idbRequest = this.DB.transaction([this.articleTableName], 'readwrite').objectStore(
      this.articleTableName
    )
    articles.forEach((article) => {
      idbRequest.put(article)
    })
  }
  getArticleByUri = (uri: string) => {
    return new Promise<Article | undefined>((resolve, reject) => {
      const idbRequest = this.DB.transaction([this.articleTableName])
        .objectStore(this.articleTableName)
        .get(uri)
      idbRequest.onerror = reject
      idbRequest.onsuccess = function () {
        resolve(idbRequest.result)
      }
    })
  }
  getAllArticles = () => {
    return new Promise<Article[]>((resolve, reject) => {
      const idbRequest = this.DB.transaction([this.articleTableName])
        .objectStore(this.articleTableName)
        .getAll()
      idbRequest.onsuccess = function () {
        resolve(idbRequest.result)
      }
      idbRequest.onerror = reject
    })
  }
  getTopicleByUri = (uri: string) => {
    return new Promise<Topic | undefined>((resolve, reject) => {
      const idbRequest = this.DB.transaction([this.topicTableName])
        .objectStore(this.topicTableName)
        .get(uri)
      idbRequest.onerror = reject
      idbRequest.onsuccess = function () {
        resolve(idbRequest.result)
      }
    })
  }
  saveTopic = (topic: Topic) => {
    return new Promise((resolve, reject) => {
      const idbRequest = this.DB.transaction([this.topicTableName], 'readwrite')
        .objectStore(this.topicTableName)
        .put(topic)
      idbRequest.onerror = reject
      idbRequest.onsuccess = resolve
    })
  }
}
const storage: Storage = new Storage()
export default storage
