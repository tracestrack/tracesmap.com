import { AtomEffect } from 'recoil'
import { variables } from '../variables'

export const localStoragePersistence =
  key =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
      setSelf(savedValue)
    }

    onSet((newValue, _, isReset) => {
      isReset ? localStorage.removeItem(key) : localStorage.setItem(key, newValue)
    })
  }

export const urlParamsPersistence =
  key =>
  ({ setSelf, onSet }) => {
    {
      const u = new URL(location.href)

      const savedValue = u.searchParams.get(key)
      if (savedValue != null) setSelf(savedValue)
    }

    onSet((newValue, _, isReset) => {
      const u = new URL(location.href)

      if (isReset || newValue === undefined) u.searchParams.delete(key)
      else u.searchParams.set(key, newValue)

      history.replaceState(null, '', u.href)
    })
  }

export const urlHashPersistence: (key: string) => AtomEffect<any> =
  key =>
  ({ setSelf, onSet }) => {
    {
      const u = new URL(location.href)
      // e.g. `/#9/32.0323/119.2003/topo/bus/vivid`
      const values = u.hash.replace('#', '').split('/')
      const index = variables.urlHashKeys.findIndex(v => v === key)
      const savedValue = values[index]
      if (savedValue !== null && savedValue !== undefined) setSelf(savedValue)
    }

    onSet((newValue, oldValue, isReset) => {
      const u = new URL(location.href)

      let values = Array(6).fill(undefined)
      let a = u.hash.replace('#', '').split('/')
      values = values.map((v, i) => a[i] || v)

      const index = variables.urlHashKeys.findIndex(v => v === key)

      if (isReset || newValue === undefined) values = values.slice(0, index)
      else values[index] = newValue

      values = values.map((v, i) => {
        if (v === null || v === undefined || v === '') {
          if (variables.urlHashKeys[i] === 'zoom') return `${variables.zoom}`
          if (variables.urlHashKeys[i] === 'lat') return `${variables.center[0]}`
          if (variables.urlHashKeys[i] === 'lon') return `${variables.center[1]}`
          if (variables.urlHashKeys[i] === 'base') return `${variables.mapBaseLayers[1]}`
          if (variables.urlHashKeys[i] === 'overlay') return `${variables.mapOverlayLayers[1]}`
          if (variables.urlHashKeys[i] === 'style') return `${variables.mapStyles[0]}`
        }
        return v
      })

      u.hash = values.join('/')

      history.replaceState(null, '', u.href)
    })
  }

export const effects = { localStoragePersistence, urlParamsPersistence, urlHashPersistence }
