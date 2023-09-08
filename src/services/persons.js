import axios from 'axios'
const baseUrl = 'http://localhost:3001'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(`${baseUrl}/api/persons`, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/api/persons/${id}`, newObject)
}

const remove = id => {
    return axios.delete(`${baseUrl}/persons/${id}`)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update,
  remove: remove 
}