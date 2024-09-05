let currentTeamId = null;

$(document).ready(async function () {
    await getWorkTeams();
    await populateEmployedDropdowns();

    $("#editWorkTeamBtn").click(function (event) {
        event.preventDefault();
        if (currentTeamId) {
            editWorkTeam(currentTeamId);
        } else {
            console.log("No se ha seleccionado ningun equipo para editar.");
        }
    });

    $('#dataTable').on('click', 'button.edit-btn', function () {
        event.preventDefault();
        currentTeamId = $(this).data('workteam-id');
        findWorkTeam(currentTeamId); 
    });

    $('#dataTable').on('click', 'button.delete-btn', function () {
        const workteamId = $(this).data('workteam-id');
        deleteWorkTeam(workteamId);
    });

});

async function getWorkTeams() {
    try {
        const request = await fetch('http://localhost:8080/work-team/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!request.ok) {
            throw new Error('Error al obtener los equipos');
        }

        const workteams = await request.json();
        console.log(workteams);

        const tableBody = document.querySelector('#dataTable tbody');

        tableBody.innerHTML = '';

      
        workteams.forEach(workteam => {
            const newRow = document.createElement('tr');
            
            const employedOneName = workteam.employedDTOS[0] ? workteam.employedDTOS[0].lastname : 'N/A';
            const employedOneLastname = workteam.employedDTOS[0] ? workteam.employedDTOS[0].name : 'N/A';
            
            const employedTwoName = workteam.employedDTOS[1] ? workteam.employedDTOS[1].lastname : 'N/A';
            const employedTwoLastname = workteam.employedDTOS[1] ? workteam.employedDTOS[1].name : 'N/A';

            
            newRow.innerHTML = `
                <td>${workteam.id}</td>
                <td class="client-name">${workteam.name}</td>
                <td class="workteam-employedOne">${employedOneName +' '+employedOneLastname}</td>
                <td class="workteam-employedTwo">${employedTwoName+' '+employedTwoLastname}</td>
                <td style="display: flex; width: 230px">
                    <form name="delete">
                        <button type="button" class="btn btn-primary btn-user btn-block delete-btn" data-workteam-id="${workteam.id}" style="background-color: red; margin-right: 5px">
                            <i class="fas fa-solid fa-trash"></i> Delete
                        </button>
                        <input type="hidden" name="id">
                    </form>
                    <form name="edit">
                        <button type="submit" class="btn btn-primary btn-user btn-block edit-btn" data-workteam-id="${workteam.id}" style="margin-left: 5px">
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


async function createWorkTeam() {
    try {
        const name = document.getElementById('txtName').value;
        const employedOneId = document.getElementById('txtEmployedOne').value;
        const employedTwoId = document.getElementById('txtEmployedTwo').value;

        let datos = {
            name: name,
            employees: [
                { id: employedOneId },
                { id: employedTwoId }
            ]
        };

        const request = await fetch('http://localhost:8080/work-team/save', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!request.ok) {
            throw new Error('Error al guardar el equipo de trabajo');
        }

        await getWorkTeams();

        const workteam = await request.json();

    } catch (error) {
        console.error(error);
    }
}

async function populateEmployedDropdowns() {
    try {
        const response = await fetch('http://localhost:8080/employed/get', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los empleados');
        }

        const employees = await response.json();

        const employedOneDropdown = document.getElementById('txtEmployedOne');
        const employedTwoDropdown = document.getElementById('txtEmployedTwo');

        employedOneDropdown.innerHTML = '<option value=""></option>';
        employedTwoDropdown.innerHTML = '<option value=""></option>';

        employees.forEach(employee => {
            const optionOne = document.createElement('option');
            const optionTwo = document.createElement('option');

            optionOne.value = employee.id;
            optionOne.textContent = `${employee.name} ${employee.lastname}`;

            optionTwo.value = employee.id;
            optionTwo.textContent = `${employee.name} ${employee.lastname}`;

            employedOneDropdown.appendChild(optionOne);
            employedTwoDropdown.appendChild(optionTwo);
        });

    } catch (error) {
        console.error(error);
    }
}

async function deleteWorkTeam(workTeamId) {
    try {
      const response = await fetch(`http://localhost:8080/work-team/delete/${workTeamId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el equipo');
      }
  
      await getWorkTeams();
    } catch (error) {
      console.error(error);
    }
}

async function findWorkTeam(workteamId) {
    try {
      const request = await fetch(`http://localhost:8080/work-team/get/${workteamId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!request.ok) {
        throw new Error('Error al obtener el equipo');
      }
  
      const selectedTeam = await request.json();
      document.getElementById('txtName').value = selectedTeam.name;
    } catch (error) {
      console.error(error);
    }
}

async function editWorkTeam(workteamId) {
    try {
        const name = document.getElementById('txtName').value;
        const employedOneId = document.getElementById('txtEmployedOne').value;
        const employedTwoId = document.getElementById('txtEmployedTwo').value;

        let datos = {
            name: name,
            employees: [
                { id: employedOneId },
                { id: employedTwoId }
            ]
        };
  
      const response = await fetch(`http://localhost:8080/work-team/edit/${workteamId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
  
      if (!response.ok) {
        throw new Error('Error al editar el equipo');
      }
  
      await getWorkTeams();
    } catch (error) {
      console.error(error);
    }
}
