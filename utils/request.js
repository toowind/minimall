const config = Symbol('config')
const isCompleteURL = Symbol('isCompleteURL')
const requestBefore = Symbol('requestBefore')
const requestAfter = Symbol('requestAfter')
import {getToken} from '../utils/auth.js'

class MinRequest {
  [config] = {
    baseURL: '',
    method: 'GET',
	data: {},
    dataType: 'json',
    responseType: 'text',
	timeout: 10000
  }
  interceptors = {
    request: (func) => {
      if (func) {
        MinRequest[requestBefore] = func
      } else {
        MinRequest[requestBefore] = (request) => request
      }
      
    },
    response: (func) => {
      if (func) {
        MinRequest[requestAfter] = func
      } else {
        MinRequest[requestAfter] = (response) => response
      }
    }
  }

  static [requestBefore] (config) {
    return config
  }

  static [requestAfter] (response) {
    return response
  }

  static [isCompleteURL] (url) {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  setConfig (func) {
    this[config] = func(this[config])
  }

  async request (options = {}) {
    let {data, baseURL, dataType, method} = await this[config],
		token = getToken() || 'MDAwMDAwMDAwMJrcepbDu7WatZ99sXzMq8rE0s6gw2JonsWIjJuCn3_FmbeJmLCrupTKiomvgqefyq6orJ7GnXlmvImAm4Kff9GZq4LcsdDbp755bZp_lXqTu720nsWca6-wdYCpgHqLyIKnlMuvqMiivrCKo4zNgsuvrKtor5p8a7CFgaiNoJnDmJaGp7O6qpLIipyuhd2b2bC61q2vYGNmxYRom5ekg8yXzGXWxavHmrJ5fqGUqnrWxNK4qauaorCvdIGplX17ko_Qad7Et61nr6Skr3zMq8rFrNqexneNrMaeaHyNeX6YgpZgog';
    options.baseURL = options.baseURL || baseURL;
    options.dataType = options.dataType || dataType;
    options.url = MinRequest[isCompleteURL](options.url) ? options.url : (options.baseURL + options.url);
    options.header = {...options.header, ...this[config].header};
    options.method = options.method || method;
	options.data = Object.assign(options.data ? options.data : {}, data);
	options.data.token = token;
    options = {...options, ...MinRequest[requestBefore](options)};
    return new Promise((resolve, reject) => {
      options.success = function (res) {
        resolve(MinRequest[requestAfter](res))
      }
      options.fail= function (err) {
        reject(MinRequest[requestAfter](err))
      }
      uni.request(options)
    })
  }

  get (url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
	options.header = {
	  'content-type': 'application/json'
	}
    return this.request(options)
  }

  post (url, data, options = {}) {
    options.url = url
    options.data = data
    options.method = 'POST'
	options.header = {
	  'content-type': 'application/x-www-form-urlencoded'
	}
    return this.request(options)
  }
}

MinRequest.install = function (Vue) {
  Vue.mixin({
    beforeCreate: function () {
		if (this.$options.minRequest) {
			Vue._minRequest = this.$options.minRequest
		}
    }
  })
  Object.defineProperty(Vue.prototype, '$Qapi', {
    get: function () {
		return Vue._minRequest.Qapis
	}
  })
  Object.defineProperty(Vue.prototype, '$Kapi', {
    get: function () {
  		return Vue._minRequest.Kapis
  	}
  })
}

export default MinRequest