  import axios, { AxiosInstance } from 'axios'
  import { boot } from 'quasar/wrappers'

  declare module 'vue/types/vue' {
    interface Vue {
      $axios: AxiosInstance;
      $api: AxiosInstance;
    }
  }

  console.log('API URL:', process.env.API_URL)

  const api = axios.create({
    baseURL: process.env.API_URL
  })

  export default boot(({ Vue }) => {
    Vue.prototype.$axios = axios
    Vue.prototype.$api = api
  })

  export { api }
