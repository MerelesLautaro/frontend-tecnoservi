let currentOrderId = null;

$(document).ready(async function () {
    await getOrders();
    await taskDropdowns();
    await stateDropdowns();
    await workTeamDropdowns();
    await clientDropdowns();

    $("#editOrderBtn").click(function (event) {
        event.preventDefault();
        if (currentOrderId) {
            editOrder(currentOrderId);
        } else {
            console.log("No se ha seleccionado ninguna orden para editar.");
        }
    });

    $('#dataTable').on('click', 'button.edit-btn', function () {
        event.preventDefault();
        currentOrderId = $(this).data('order-id');
        findOrder(currentOrderId); 
    });

    $('#dataTable').on('click', 'button.delete-btn', function () {
        const orderId = $(this).data('order-id');
        deleteOrder(orderId);
    });
});

async function getOrders() {
    try {
        const request = await fetch('http://localhost:8080/order/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener las ordenes');
        }

        const orders = await request.json();
        console.log(orders);

        const tableBody = document.querySelector('#dataTable tbody');

        tableBody.innerHTML = '';

      
        orders.forEach(order => {
            const newRow = document.createElement('tr');
            
            newRow.innerHTML = `
                <td>${order.id}</td>
                <td class="order-name">${order.nameClient}</td>
                <td class="order-name">${order.address}</td>
                <td class="order-name">${order.date}</td>
                <td class="order-name">${order.task.name}</td>
                <td class="order-name">${order.workTeamDTO.name}</td>
                <td class="workteam-employedOne">${order.state.name}</td>
                <td style="display: flex; width: 230px">
                    <form name="delete">
                        <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-order-id="${order.id}" style="background-color: red; margin-right: 5px">
                            <i class="fas fa-solid fa-trash"></i> Delete
                        </button>
                        <input type="hidden" name="id">
                    </form>
                    <form name="edit">
                        <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-order-id="${order.id}" style="margin-left: 5px">
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

async function taskDropdowns() {
    try {
        const response = await fetch('http://localhost:8080/task/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las tareas');
        }

        const tasks = await response.json();

        const taskDropdown = document.getElementById('txtTask');

        taskDropdown.innerHTML = '<option value=""></option>';


        tasks.forEach(task => {
            const optionTask = document.createElement('option');

            optionTask.value = task.id;
            optionTask.textContent = `${task.name}`;

            taskDropdown.appendChild(optionTask);
        });

    } catch (error) {
        console.error(error);
    }
}

async function stateDropdowns() {
    try {
        const response = await fetch('http://localhost:8080/state/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los estados');
        }

        const states = await response.json();

        const stateDropdown = document.getElementById('txtStatus');

        stateDropdown.innerHTML = '<option value=""></option>';


        states.forEach(state => {
            const optionState = document.createElement('option');

            optionState.value = state.id;
            optionState.textContent = `${state.name}`;

            stateDropdown.appendChild(optionState);
        });

    } catch (error) {
        console.error(error);
    }
}

async function workTeamDropdowns() {
    try {
        const response = await fetch('http://localhost:8080/work-team/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los equipos');
        }

        const workTeams = await response.json();

        const workTeamDropdown = document.getElementById('txtWorkTeam');

        workTeamDropdown.innerHTML = '<option value=""></option>';


        workTeams.forEach(workteam => {
            const optionWorkTeam = document.createElement('option');

            optionWorkTeam.value = workteam.id;
            optionWorkTeam.textContent = `${workteam.name}`;

            workTeamDropdown.appendChild(optionWorkTeam);
        });

    } catch (error) {
        console.error(error);
    }
}

async function clientDropdowns() {
    try {
        const response = await fetch('http://localhost:8080/client/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los clientes');
        }

        const clients = await response.json();

        const clientDropdown = document.getElementById('txtClient');

        clientDropdown.innerHTML = '<option value=""></option>';


        clients.forEach(client => {
            const optionClient = document.createElement('option');

            optionClient.value = client.id;
            optionClient.textContent = `${client.lastname} ${client.name}`;
            optionClient.setAttribute('data-address', client.address);

            document.getElementById('txtClient').addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                const address = selectedOption.getAttribute('data-address');
                document.getElementById('txtAddress').value = address || '';
            });

            clientDropdown.appendChild(optionClient);
        });

    } catch (error) {
        console.error(error);
    }
}

async function createOrder() {
    try {
        const address = document.getElementById('txtAddress').value;
        const date = document.getElementById('txtDate').value;
        const task = document.getElementById('txtTask').value;
        const state = document.getElementById('txtStatus').value;
        const client = document.getElementById('txtClient').value;
        const workTeam = document.getElementById('txtWorkTeam').value;
        

        let datos = {
            address: address,
            date: date,
            task: { id: task},
            state:{id: state},
            client:{id: client},
            workTeam: {id: workTeam}
        };

        const request = await fetch('http://localhost:8080/order/save', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!request.ok) {
            throw new Error('Error al guardar la orden');
        }

        await getOrders();

        const order = await request.json();

    } catch (error) {
        console.error(error);
    }
}

async function deleteOrder(orderId) {
    try {
      const response = await fetch(`http://localhost:8080/order/delete/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar la orden');
      }
  
      await getOrders();
    } catch (error) {
      console.error(error);
    }
}


async function editOrder(orderId) {
    try {
        const address = document.getElementById('txtAddress').value;
        const date = document.getElementById('txtDate').value;
        const task = document.getElementById('txtTask').value;
        const state = document.getElementById('txtStatus').value;
        const client = document.getElementById('txtClient').value;
        const workTeam = document.getElementById('txtWorkTeam').value;
        

        let datos = {
            address: address,
            date: date,
            task: { id: task},
            state:{id: state},
            client:{id: client},
            workTeam: {id: workTeam}
        };
  
      const response = await fetch(`http://localhost:8080/order/edit/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
  
      if (!response.ok) {
        throw new Error('Error al editar la orden');
      }
  
      await getOrders();
    } catch (error) {
      console.error(error);
    }
}

async function findOrder(orderId) {
    try {
      const request = await fetch(`http://localhost:8080/order/get/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener la orden');
      }
  
        const selectedOrder = await request.json();
        document.getElementById('txtAddress').value = selectedOrder.address;
        document.getElementById('txtDate').value = selectedOrder.date;
    } catch (error) {
      console.error(error);
    }
}
