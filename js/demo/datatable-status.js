let currentStateId = null;

$(document).ready(async function () {
    await getStatuses();
    $('#dataTable').DataTable();

    $("#editStateBtn").click(function (event) {
        event.preventDefault();
        if (currentStateId) {
            editState(currentStateId);
        } else {
            console.log("No se ha seleccionado ningun estado para editar.");
        }
    });

    $('#dataTable').on('click', 'button.edit-btn', function () {
        event.preventDefault();
        currentStateId= $(this).data('state-id');
        findState(currentStateId); 
      });

    $('#dataTable').on('click', 'button.delete-btn', function () {
        const stateId = $(this).data('state-id');
        deleteState(stateId);
    });

});

async function getStatuses() {
    try {
        const request = await fetch('http://localhost:8080/state/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener los estados');
        }

        const statuses = await request.json();
        console.log(statuses);

        const tableBody = document.querySelector('#dataTable tbody');

        tableBody.innerHTML = '';

      
        statuses.forEach(state => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${state.id}</td>
                    <td class="state-name">${state.name}</td>
                    <td style="display: flex; width: 230px">
                        <form name="delete">
                            <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-state-id="${state.id}" style="background-color: red; margin-right: 5px">
                                <i class="fas fa-solid fa-trash"></i> Delete
                            </button>
                            <input type="hidden" name="id">
                        </form>
                        <form name="edit">
                            <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-state-id="${state.id}" style="margin-left: 5px">
                                <i class="fas fa-pencil-alt"></i> Edit
                            </button>
                            <input type="hidden" name="id">
                        </form>
                    </td>
                `;
                tableBody.appendChild(newRow);
        });    

    } catch (error) {
        console.error(error);
    }
}

async function createState() {
    try {
        let datos = {
            name: document.getElementById('txtName').value
        }

  
      const request = await fetch('http://localhost:8080/state/save', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      await getStatuses();
  
      const state = await request.json();
  
    } catch (error) {
      console.error(error);
    }
}

async function deleteState(stateId) {
    try {
      const response = await fetch(`http://localhost:8080/state/delete/${stateId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el estado');
      }
  
      await getStatuses();
    } catch (error) {
      console.error(error);
    }
}

async function editState(stateId) {
    console.log("La id es dentro de edit: "+stateId);
    try {
      let datos = {
        id: stateId,
        name: document.getElementById('txtName').value
      };
  
      const response = await fetch(`http://localhost:8080/state/edit/${stateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
  
      if (!response.ok) {
        throw new Error('Error al editar el estado');
      }
  
      await getStatuses();
      console.log('estado editada correctamente');
    } catch (error) {
      console.error(error);
    }
}

async function findState(stateId) {
    try {
      const request = await fetch(`http://localhost:8080/state/get/${stateId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener el estado');
      }
  
      const selectedState = await request.json();
      document.getElementById('txtName').value = selectedState.name;
    } catch (error) {
      console.error(error);
    }
  }