export function cacheData(url: string, response: any) {
  localStorage.setItem(url, JSON.stringify(response))
}

export function readFromCache(url: string): any {
  return JSON.parse(localStorage.getItem(url) || 'null')
}
