let currentClientId = null;

$(document).ready(async function () {
    await getClients();

    $("#editClientBtn").click(function (event) {
        event.preventDefault();
        if (currentClientId) {
            editClient(currentClientId);
        } else {
            console.log("No se ha seleccionado ningun cliente para editar.");
        }
    });

    $('#dataTable').on('click', 'button.edit-btn', function () {
        event.preventDefault();
        currentClientId = $(this).data('client-id');
        findClient(currentClientId); 
      });

    $('#dataTable').on('click', 'button.delete-btn', function () {
        const clientId = $(this).data('client-id');
        deleteClient(clientId);
    });

});

async function getClients() {
    try {
        const request = await fetch('http://localhost:8080/client/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener los clientes');
        }

        const clients = await request.json();
        console.log(clients);

        const tableBody = document.querySelector('#dataTable tbody');

        tableBody.innerHTML = '';

      
        clients.forEach(client => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${client.id}</td>
                    <td class="client-name">${client.name}</td>
                    <td class="client-lastname">${client.lastname}</td>
                    <td class="client-dni">${client.dni}</td>
                    <td class="client-cel">${client.cel}</td>
                    <td class="client-email">${client.email}</td>
                    <td class="client-address">${client.address}</td>
                    <td style="display: flex; width: 230px">
                        <form name="delete">
                            <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-client-id="${client.id}" style="background-color: red; margin-right: 5px">
                                <i class="fas fa-solid fa-trash"></i> Delete
                            </button>
                            <input type="hidden" name="id">
                        </form>
                        <form name="edit">
                            <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-client-id="${client.id}" style="margin-left: 5px">
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

async function createClient() {
    try {
        let datos = {
            name: document.getElementById('txtName').value,
            lastname: document.getElementById('txtLastname').value,
            dni: document.getElementById('txtDNI').value,
            email: document.getElementById('txtEmail').value,
            cel: document.getElementById('txtCel').value,
            address: document.getElementById('txtAddress').value
        }
  
        const request = await fetch('http://localhost:8080/client/save', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });
      
    await getClients();
  
    const client = await request.json();
  
    } catch (error) {
      console.error(error);
    }
}

async function deleteClient(clientId) {
    try {
      const response = await fetch(`http://localhost:8080/client/delete/${clientId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el cliente');
      }
  
      await getClients();
    } catch (error) {
      console.error(error);
    }
}

async function editClient(clientId) {
    try {
        let datos = {
            name: document.getElementById('txtName').value,
            lastname: document.getElementById('txtLastname').value,
            dni: document.getElementById('txtDNI').value,
            email: document.getElementById('txtEmail').value,
            cel: document.getElementById('txtCel').value,
            address: document.getElementById('txtAddress').value
        };
  
      const response = await fetch(`http://localhost:8080/client/edit/${clientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
  
      if (!response.ok) {
        throw new Error('Error al editar el cliente');
      }
  
      await getClients();
    } catch (error) {
      console.error(error);
    }
}

async function findClient(clientId) {
    try {
      const request = await fetch(`http://localhost:8080/client/get/${clientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener el cliente');
      }
  
      const selectedClient = await request.json();
      document.getElementById('txtName').value = selectedClient.name;
      document.getElementById('txtLastname').value = selectedClient.lastname;
      document.getElementById('txtDNI').value = selectedClient.dni;
      document.getElementById('txtEmail').value = selectedClient.email;
      document.getElementById('txtCel').value = selectedClient.cel;
      document.getElementById('txtAddress').value = selectedClient.address;
    } catch (error) {
      console.error(error);
    }
}