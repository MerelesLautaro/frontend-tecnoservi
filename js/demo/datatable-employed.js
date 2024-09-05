let currentEmployedId = null;

$(document).ready(async function () {
    await getEmployees();

    $("#editEmployedBtn").click(function (event) {
        event.preventDefault();
        if (currentEmployedId) {
            editEmployed(currentEmployedId);
        } else {
            console.log("No se ha seleccionado ningun empleado para editar.");
        }
    });

    $('#dataTable').on('click', 'button.edit-btn', function () {
        event.preventDefault();
        currentEmployedId = $(this).data('employed-id');
        findEmployed(currentEmployedId); 
      });

    $('#dataTable').on('click', 'button.delete-btn', function () {
        const employedId = $(this).data('employed-id');
        deleteEmployed(employedId);
    });

});

async function getEmployees() {
    try {
        const request = await fetch('http://localhost:8080/employed/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener los empleados');
        }

        const employees = await request.json();
        console.log(employees);

        const tableBody = document.querySelector('#dataTable tbody');

        tableBody.innerHTML = '';

      
        employees.forEach(employed => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${employed.id}</td>
                    <td class="employed-name">${employed.name}</td>
                    <td class="employed-lastname">${employed.lastname}</td>
                    <td class="employed-dni">${employed.dni}</td>
                    <td class="employed-cel">${employed.cel}</td>
                    <td class="employed-email">${employed.email}</td>
                    <td class="employed-workTeamName">${employed.workTeamName}</td>
                    <td style="display: flex; width: 230px">
                        <form name="delete">
                            <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-employed-id="${employed.id}" style="background-color: red; margin-right: 5px">
                                <i class="fas fa-solid fa-trash"></i> Delete
                            </button>
                            <input type="hidden" name="id">
                        </form>
                        <form name="edit">
                            <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-employed-id="${employed.id}" style="margin-left: 5px">
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

async function createEmployed() {
    try {
        let datos = {
            name: document.getElementById('txtName').value,
            lastname: document.getElementById('txtLastname').value,
            dni: document.getElementById('txtDNI').value,
            email: document.getElementById('txtEmail').value,
            cel: document.getElementById('txtCel').value
        }
  
        const request = await fetch('http://localhost:8080/employed/save', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });
      
    await getEmployees();
  
    const employed = await request.json();
  
    } catch (error) {
      console.error(error);
    }
}

async function deleteEmployed(employedId) {
    try {
      const response = await fetch(`http://localhost:8080/employed/delete/${employedId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el empleado');
      }
  
      await getEmployees();
    } catch (error) {
      console.error(error);
    }
}

async function editEmployed(employedId) {
    try {
        let datos = {
            name: document.getElementById('txtName').value,
            lastname: document.getElementById('txtLastname').value,
            dni: document.getElementById('txtDNI').value,
            email: document.getElementById('txtEmail').value,
            cel: document.getElementById('txtCel').value
        };
  
      const response = await fetch(`http://localhost:8080/employed/edit/${employedId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
  
      if (!response.ok) {
        throw new Error('Error al editar el empleado');
      }
  
      await getEmployees();
    } catch (error) {
      console.error(error);
    }
}

async function findEmployed(employedId) {
    try {
      const request = await fetch(`http://localhost:8080/employed/get/${employedId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener el empleado');
      }
  
      const selectedEmployed = await request.json();
      document.getElementById('txtName').value = selectedEmployed.name;
      document.getElementById('txtLastname').value = selectedEmployed.lastname;
      document.getElementById('txtDNI').value = selectedEmployed.dni;
      document.getElementById('txtEmail').value = selectedEmployed.email;
      document.getElementById('txtCel').value = selectedEmployed.cel;
    } catch (error) {
      console.error(error);
    }
  }