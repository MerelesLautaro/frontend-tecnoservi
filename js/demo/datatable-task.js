let currentTaskId = null;

$(document).ready(async function () {
    await getTasks();
    $('#dataTable').DataTable();

    $("#editTaskBtn").click(function (event) {
        event.preventDefault();
        if (currentTaskId) {
            editTask(currentTaskId);
        } else {
            console.log("No se ha seleccionado ninguna tarea para editar.");
        }
    });

    $('#dataTable').on('click', 'button.edit-btn', function () {
        event.preventDefault();
        currentTaskId = $(this).data('task-id');
        findTask(currentTaskId); 
      });

    $('#dataTable').on('click', 'button.delete-btn', function () {
        const taskId = $(this).data('task-id');
        deleteTask(taskId);
    });
});

async function getTasks(){
    try {
        const request = await fetch('http://localhost:8080/task/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener las tareas');
        }

        const tasks = await request.json();
        console.log(tasks);

        const tableBody = document.querySelector('#dataTable tbody');

        tableBody.innerHTML = '';

      
        tasks.forEach(task => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${task.id}</td>
                    <td class="task-name">${task.name}</td>
                    <td style="display: flex; width: 230px">
                        <form name="delete">
                            <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-task-id="${task.id}" style="background-color: red; margin-right: 5px">
                                <i class="fas fa-solid fa-trash"></i> Delete
                            </button>
                            <input type="hidden" name="id">
                        </form>
                        <form name="edit">
                            <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-task-id="${task.id}" style="margin-left: 5px">
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

async function createTask() {
    try {
        let datos = {
            name: document.getElementById('txtName').value
        }

  
      const request = await fetch('http://localhost:8080/task/save', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      await getTasks();
  
      const task = await request.json();
  
    } catch (error) {
      console.error(error);
    }
}

async function deleteTask(taskId) {
    try {
      const response = await fetch(`http://localhost:8080/task/delete/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar la tarea');
      }
  
      await getTasks();
    } catch (error) {
      console.error(error);
    }
}

async function editTask(taskId) {
    console.log("La id es dentro de edit: "+taskId);
    try {
      let datos = {
        id: taskId,
        name: document.getElementById('txtName').value
      };
  
      const response = await fetch(`http://localhost:8080/task/edit/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
  
      if (!response.ok) {
        throw new Error('Error al editar la tarea');
      }
  
      await getTasks();
      console.log('tarea editada correctamente');
    } catch (error) {
      console.error(error);
    }
}

async function findTask(taskId) {
    try {
      const request = await fetch(`http://localhost:8080/task/get/${taskId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener la tarea');
      }
  
      const selectedTask = await request.json();
      document.getElementById('txtName').value = selectedTask.name;
    } catch (error) {
      console.error(error);
    }
}