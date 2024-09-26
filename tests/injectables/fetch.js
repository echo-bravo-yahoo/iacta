let calls = []
let returnVal

export default async function fakeFetch(...args) {
  calls.push(args)
  return {
    json: async () => returnVal
  }
}

fakeFetch.get = () => calls
fakeFetch.reset = () => calls = []
fakeFetch.next = (_returnVal) => returnVal = _returnVal
