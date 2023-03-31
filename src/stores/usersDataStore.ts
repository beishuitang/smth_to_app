import { reactive } from 'vue'
import { UserData, type UsersData } from '@/scripts/class/UserData'
import { defineStore } from 'pinia'
import storage from '@/scripts/storage'

export const useUsersDataStore = defineStore('usersDataStore', () => {
  const usersData: UsersData = reactive({})
  function getUserById(id: string) {
    if (!Object.prototype.hasOwnProperty.call(usersData, id)) {
      usersData[id] = new UserData(id)
    }
    return usersData[id]
  }
  function initUsersData() {
    return new Promise<void>((resolve, reject) => {
      storage
        .getAllUserData()
        .then((usersDataArr) => {
          usersDataArr.forEach((userData) => {
            usersData[userData.id] = userData
          })
          resolve()
        })
        .catch(reject)
    })
  }
  function saveUserData(idData: UserData) {
    storage.saveUserData(JSON.parse(JSON.stringify(idData)))
  }
  return { getUserById, usersData, saveUserData, initUsersData }
})
