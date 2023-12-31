import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])

  const [filteredPersons, setFiltered] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [idToDelete, setIdToDelete] = useState(0)

  const [infomessage, setInfomessage] = useState(null)
  const [errormessage, setErrormessage] = useState(null)

  const hook = () => {
    personService
      .getAll('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
        setFiltered(response.data)
      })
  }
  
  /*
  useEffect(() => {
    personService
    .getAll('http://localhost:3001/persons')
    .then(response => {
      console.log(response.data)
      setPersons(response.data)
      setFiltered(persons)
    })
  }, [setFiltered]);

  */
  useEffect(hook, [])

  const handleName = (event) => {
    setNewName(event.target.value)
  }

  const handleNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value.toLowerCase())
    if(filter === ""){
      setFiltered(persons)
    }
    else{
      setFiltered(persons.filter(person => person.name.toLowerCase().includes(filter)))
    }
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber
    }
    if (!persons.some(person => person.name === newName)) {
      personService.create(person)    
      .then(response => {      
        setPersons(persons.concat(person))
        setNewName('')
        setNewNumber('')
        setFilter('')
        setFiltered(persons)
        setInfomessage(`${person.name} added to the phonebook`)
        setTimeout(() => {setInfomessage(null)}, 3000)
      })
      
      .catch(error => {
        setErrormessage(`error in the definiton of name or number`)
        setTimeout(() => {setErrormessage(null)}, 3000)
      })

    }
    else {
      
      let i = 0
      let idToUpdate = 0
      while (i < persons.length){
        if (newName === persons[i].name){
          idToUpdate = persons[i].id
        }
        i = i + 1
      }
      console.log(idToUpdate)
      personService.update(idToUpdate, person).then(response => {      
        setPersons(persons.concat(person))
        setNewName('')
        setNewNumber('')
        setFilter('')
        setFiltered(persons)
      })
      alert(`${newName} is already added to phonebook, updating number`)
    }
  }
  
  const removePerson = (event, id) => {
    event.preventDefault()
    personService
      .remove(id)
      .then(response => {
        setPersons(persons)
      }).catch(error => {
        setErrormessage(`This person was already removed from server`)        
        setTimeout(() => {setErrormessage(null)}, 5000)
        setFiltered(filteredPersons.filter(n => n.id !== id))
      })
  }

  console.log(Array.isArray(filteredPersons))
  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        {<FilterForm filter={filter} handleFilter={handleFilter} />}
      </div>
      <div>
        <Notification message={infomessage} />
        <Errormessage message={errormessage} />
      </div>
      <h2>Add new</h2>

      {<AddpersonForm addPerson={addPerson} newName={newName} handleName={handleName} newNumber={newNumber} handleNumber={handleNumber} removePerson = {removePerson} personService = {personService} />}
      <h2>Numbers</h2>
      <ul>
        {Array.isArray(filteredPersons) ? filteredPersons.map(person => <Person key={person.name} name={person.name} number={person.number} id = {person.id} removePerson = {removePerson}/>): <p> No numbers saved </p>}
      </ul>
    </div>
  )

}

const FilterForm = (props) => {
  return (
    <div>filter shown with: <input value={props.filter} onChange={props.handleFilter} /></div>
  )
}


const AddpersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>name: <input value={props.newName} onChange={props.handleName} /></div>
      <div>number: <input value={props.newNumber} onChange={props.handleNumber} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const Person = (props) => {
  return (
    <li>
    {props.name} {props.number} {props.id}
    <form onSubmit={(event) => props.removePerson(event, props.id)}>
    <input type="hidden" id={props.id}/>
    <button type="submit">Delete</button>
    </form>
    </li>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="infomsg">
      {message}
    </div>
  )
}
  
const Errormessage = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}

export default App