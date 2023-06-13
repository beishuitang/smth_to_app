import type { UserData } from './class/UserData'
import type { Article } from './class/Article'
import type { Topic } from './class/Topic'
import type { Img } from './class/Img'

class Storage {
  DB!: IDBDatabase
  userTableName = 'user'
  articleTableName = 'article'
  topicTableName = 'topic'
  objectTableName = 'file'
  imgTableName = 'img'
  ipFileKey = 'ipFile'
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
          this.DB.createObjectStore(this.userTableName, { keyPath: 'id' }).createIndex(
            'update_time',
            'u'
          )
        }
        if (!this.DB.objectStoreNames.contains(this.articleTableName)) {
          this.DB.createObjectStore(this.articleTableName, { keyPath: 'articleUri' }).createIndex(
            'update_time',
            'u'
          )
        }
        if (!this.DB.objectStoreNames.contains(this.topicTableName)) {
          this.DB.createObjectStore(this.topicTableName, { keyPath: 'topicUri' }).createIndex(
            'update_time',
            'u'
          )
        }
        if (!this.DB.objectStoreNames.contains(this.imgTableName)) {
          this.DB.createObjectStore(this.imgTableName, { keyPath: 'imgUri' }).createIndex(
            'update_time',
            'u'
          )
        }
        if (!this.DB.objectStoreNames.contains(this.objectTableName)) {
          this.DB.createObjectStore(this.objectTableName)
        }
      }
    })
  }
  saveUserData = (userData: UserData) => {
    return new Promise((resolve, reject) => {
      userData.u = Date.now()
      const idbRequest = this.DB.transaction([this.userTableName], 'readwrite')
        .objectStore(this.userTableName)
        .put(userData)
      idbRequest.onsuccess = resolve
      idbRequest.onerror = reject
    })
  }
  saveAllUserData = (usersData: UserData[]) => {
    return this.saveAll(usersData, this.userTableName)
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
      article.u = Date.now()
      const idbRequest = this.DB.transaction([this.articleTableName], 'readwrite')
        .objectStore(this.articleTableName)
        .put(article)
      idbRequest.onsuccess = resolve
      idbRequest.onerror = reject
    })
  }
  saveAllArticle = (articles: Article[]) => {
    return this.saveAll(articles, this.articleTableName)
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
  getAllArticle = () => {
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
      topic.u = Date.now()
      const idbRequest = this.DB.transaction([this.topicTableName], 'readwrite')
        .objectStore(this.topicTableName)
        .put(topic)
      idbRequest.onerror = reject
      idbRequest.onsuccess = resolve
    })
  }
  saveImg = (img: Img) => {
    return new Promise((resolve, reject) => {
      if (img.data.type.startsWith('image/')) {
        img.u = Date.now()
        const idbRequest = this.DB.transaction([this.imgTableName], 'readwrite')
          .objectStore(this.imgTableName)
          .put(img)
        idbRequest.onsuccess = resolve
        idbRequest.onerror = reject
      } else {
        reject()
      }
    })
  }
  saveAllImg = (imgs: Img[]) => {
    return this.saveAll(imgs, this.imgTableName)
  }
  getImgByUri = (uri: string) => {
    return new Promise<Img | undefined>((resolve, reject) => {
      const idbRequest = this.DB.transaction([this.imgTableName])
        .objectStore(this.imgTableName)
        .get(uri)
      idbRequest.onerror = reject
      idbRequest.onsuccess = function () {
        resolve(idbRequest.result)
      }
    })
  }
  getAllImg = () => {
    return new Promise<Img[]>((resolve, reject) => {
      const idbRequest = this.DB.transaction([this.imgTableName])
        .objectStore(this.imgTableName)
        .getAll()
      idbRequest.onsuccess = function () {
        resolve(idbRequest.result)
      }
      idbRequest.onerror = reject
    })
  }

  getIpDB = () => {
    return new Promise<Blob | undefined>((resolve, reject) => {
      const idbRequest = this.DB.transaction([this.objectTableName])
        .objectStore(this.objectTableName)
        .get(this.ipFileKey)
      idbRequest.onerror = reject
      idbRequest.onsuccess = function () {
        resolve(idbRequest.result)
      }
    })
  }
  saveIpDB = (db: Blob) => {
    return new Promise((resolve, reject) => {
      const idbRequest = this.DB.transaction([this.objectTableName], 'readwrite')
        .objectStore(this.objectTableName)
        .put(db, this.ipFileKey)
      idbRequest.onerror = reject
      idbRequest.onsuccess = resolve
    })
  }
  saveAll = (datas: UserData[] | Topic[] | Article[] | Img[], tableName: string) => {
    return new Promise((resolve, reject) => {
      const idbTransaction = this.DB.transaction([tableName], 'readwrite')
      const idbObjectStore = idbTransaction.objectStore(tableName)
      datas.forEach((data) => {
        data.u = Date.now()
        idbObjectStore.put(data)
      })
      idbTransaction.oncomplete = resolve
      idbTransaction.onerror = reject
    })
  }
}
const storage: Storage = new Storage()
export default storage
