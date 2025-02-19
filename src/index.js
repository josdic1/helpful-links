
const init = () => {

  //DOM elements
  const header = document.getElementById('header')
  const form = document.getElementById('form')
  const list = document.getElementById('list')

  //stateful variables

  let inEditMode = false

  let links = []

  let formData = {
    title: "",
    url: "",
    type: "",
    paid: false
  }

  let selectedLink = {
    id: "",
    title: "",
    url: "",
    type: "",
    paid: false
  }

  let errorMessage;

  //initial fetch
  fetchLinks()


  //render header
  function renderHeader() {
    const headerHtml =
      `<p>${inEditMode ? "EDIT-MODE" : "VIEW-MODE"}</p>`

  }


  //render form
  function renderForm() {
    const formHtml =
      `<label for="inputTitle">Title: </label>
      <input type="text" id="inputTitle" class="form-input" name="title" placeholder="Website name goes here..." />
      <label for="inputUrl">URL: </label>
      <input type="url" id="inputUrl" class="form-input" name="url" placeholder="URL goes here..." />
      <label for="inputType">Type: </label>
      <input type="text" id="inputType" class="form-input" name="type" placeholder="Link type goes here..." />
      <label for="inputPaid">Paid: </label>
      <input type="checkbox" id="inputPaid" class="form-input" name="paid" !checked/>
      <button type='submit' class="form-button" name="submit" id="buttonSubmit">${inEditMode ? "Update" : "Add New"}</button>
       <button type='button' class="form-button" name="clear" id="buttonClear">Clear</button>
      `


    form.innerHTML = formHtml

    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', handleFormInput)
    })

    document.getElementById('buttonSubmit').addEventListener('click', handleSubmitClick)

    document.getElementById('buttonClear').addEventListener('click', handleClearClick)

  }

  // form handler fucntions
  function handleFormInput(e) {
    const { name, type, value, checked } = e.target
    formData = {
      ...formData,
      [name]: type !== 'checkbox' ? value : checked
    }
  }

  function handleSubmitClick(e) {
    e.preventDefault()
    let formInput = {}
    if (inEditMode) {
      selectedLink = {
        ...selectedLink,
        title: document.getElementById('inputTitle').value,
        url: document.getElementById('inputUrl').value,
        type: document.getElementById('inputType').value,
        paid: document.getElementById('inputPaid').checked
      }
      formInput = selectedLink
      handleUpdatedLink(formInput)
    } else {
      formInput = formData
      handleNewLink(formInput)
    }

  }


  function handleClearClick() {
    document.getElementById('inputTitle').value = ''
    document.getElementById('inputUrl').value = ''
    document.getElementById('inputType').value = ''
    document.getElementById('inputPaid').value = false
  }

  //render list
  function renderList(data) {
    const linkList = data.map(link => (
      `<tr>
        <td>${link.id}</td>
        <td>${link.title}</td>
        <td>${link.type}</td>
        <td>${link.paid ? "paid" : "free"}</td>
        <td>
          <button type='button' class='list-button' name='view' id=${link.id}>
            View
          </button>
        </td>
        <td>
          <button type='button' class='list-button' name='edit' id=${link.id}>
            Edit
          </button>
        </td>
        <td>
          <button type='button' class='list-button' name='del' id=${link.id}>
            Del
          </button>
          <td>${link.url === "" ? "🚫 URL" : ""}</td>
        </td>
      </tr>`
    ))

    const listHtml =
      `<table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>$$</th>
            <th>View</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>⚠</th>
          </tr>
        </thead>
        <tbody>
          ${linkList.join('')}
        </tbody>
      </table>`

    list.innerHTML = listHtml

    document.querySelectorAll('.list-button').forEach(btn => {
      btn.addEventListener('click', handleListButtonClick)
    })




  }

  // list button handler function

  function handleListButtonClick(e) {
    const { id, name } = e.target
    const linkObject = links.find(link => (
      link.id === id
    ))
    switch (name) {
      case 'view':
        onViewClick(linkObject)
        selectedLink = linkObject
        break;
      case 'edit':
        inEditMode = true
        onEditClick(linkObject)
        selectedLink = linkObject
        break;
      case 'del':
        handleDelete(linkObject)
        break;
      default:
        break;
    }
  }

  // view button click
  function onViewClick(obj) {
    if (obj.url === "") {
      console.error('The URL is empty!')
      return;
    } else {
      window.open(`${obj.url}`, '_blank');
    }
  }

  //edit button click
  function onEditClick(obj) {
    selectedLink = obj
    document.getElementById('inputTitle').value = obj.title;
    document.getElementById('inputUrl').value = obj.url;
    document.getElementById('inputType').value = obj.type;
    document.getElementById('inputPaid').checked = obj.paid;
  }



  //async fucntions
  //GET

  async function fetchLinks() {
    try {
      const r = await fetch(`http://localhost:3000/links`)
      if (!r.ok) {
        throw new Error('GET: bad request')
      }
      const data = await r.json()
      links = data
      renderList(data)
      renderForm()
      renderHeader()
    } catch (error) { console.error(error) }
  }

  async function handleNewLink(newObj) {
    try {
      const r = await fetch(`http://localhost:3000/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObj)
      })
      if (!r.ok) {
        throw new Error('POST: bad request')
      }
      await fetchLinks()
    } catch (error) { console.error(error) }
  }


  async function handleDelete(obj) {
    try {
      const r = await fetch(`http://localhost:3000/links/${obj.id}`, {
        method: 'DELETE'
      })
      if (!r.ok) {
        throw new Error('DELETE: bad request')
      }
      await fetchLinks()
    } catch (error) { console.error(error) }
  }

  async function handleUpdatedLink(updatedObj) {
    try {
      const r = await fetch(`http://localhost:3000/links/${updatedObj.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedObj)
      })
      if (!r.ok) {
        throw new Error('PATCH: bad request')
      }
      await fetchLinks()
    } catch (error) { console.error(error) }
  }



}

window.addEventListener("DOMContentLoaded", init)