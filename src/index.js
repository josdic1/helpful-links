
const init = () => {

  //DOM elements
  const header = document.getElementById('header')
  const form = document.getElementById('form')
  const list = document.getElementById('list')

  //stateful variables
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

  //initial fetch
  fetchLinks()

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
          </tr>
        </thead>
        <tbody>
          ${linkList}
        </tbody>
      </table>`

    list.innerHTML = listHtml

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
    } catch (error) { console.error(error) }
  }




}

window.addEventListener("DOMContentLoaded", init)