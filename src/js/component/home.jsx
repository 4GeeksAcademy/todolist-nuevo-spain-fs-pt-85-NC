import React, { useEffect, useState } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");
  const [tareas, setTareas] = useState([]);

  // Crear usuario
  const crearUsuario = () => {
    fetch("https://playground.4geeks.com/todo/users/nachocordoba", {
      method: "GET",
      headers: { "Accept": "application/json" }
    })
    .then(responseCheck => {
      if (responseCheck.ok) {
        console.log("El usuario ya existe.");
        return;
      }

      return fetch("https://playground.4geeks.com/todo/users/nachocordoba", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "nachocordoba" })
      });
    })
    .then(responseCreate => {
      if (responseCreate && !responseCreate.ok) {
        throw new Error("No se pudo crear el usuario");
      }
      console.log("Usuario creado exitosamente.");
    })
    .catch(error => {
      console.error("Error al crear usuario:", error);
    });
  };

  // Obtener tareas
  const getInfoTareas = () => {
    fetch("https://playground.4geeks.com/todo/users/nachocordoba", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudieron obtener las tareas");
      }
      return response.json();
    })
    .then(data => {
      if (data && Array.isArray(data.todos)) {
        setTareas(data.todos);
      } else {
        console.error("La propiedad 'todos' no es un array", data);
      }
    })
    .catch(error => {
      console.error("Error al obtener tareas:", error);
    });
  };

  // Agregar tarea
  const agregarTareas = (nuevaTarea) => {
    const tarea = { label: nuevaTarea, is_done: false };

    fetch("https://playground.4geeks.com/todo/todos/nachocordoba", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarea),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo agregar la tarea");
      }
      return response.json();
    })
    .then(data => {
      setTareas([...tareas, data]);
    })
    .catch(error => {
      console.error("Error al agregar tarea:", error);
    });
  };

  // Eliminar tarea
  const eliminarTarea = (tareaId) => {
    console.log('Tarea ID:', tareaId);  
    const tarea = tareas.find(t => t.id === tareaId);  
    if (!tarea) {
      console.error("No se encontró la tarea con el ID:", tareaId);
      return;  
    }

    const tareaActualizada = {...tarea, is_done: true };
  
    fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
      method: "PUT",  
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json" 
      },
      body: JSON.stringify(tareaActualizada),  
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo actualizar la tarea");
      }
      return response.json();  
    })
    .then(updatedTask => {
      setTareas(tareas.filter(t => t.id !== tareaId));  
    })
    .catch(error => {
      console.error("Error al actualizar tarea:", error);
    });
  };

  // Eliminar todas las tareas
const eliminarTodasLasTareas = () => {
	// Aquí obtenemos todas las tareas del servidor
	fetch("https://playground.4geeks.com/todo/users/nachocordoba", {
	  method: "GET",
	  headers: { "Content-Type": "application/json" },
	})
	.then(response => response.json())
	.then(data => {
	  // Ahora eliminamos todas las tareas del servidor
	  const eliminarTareasPromises = data.todos.map(tarea => {
		return fetch(`https://playground.4geeks.com/todo/todos/${tarea.id}`, {
		  method: "DELETE",
		  headers: { "Content-Type": "application/json" },
		});
	  });
  
	  // Ejecutamos todas las promesas para eliminar las tareas
	  Promise.all(eliminarTareasPromises)
		.then(() => {
		  // Actualizamos el estado para reflejar que ya no hay tareas
		  setTareas([]);
		})
		.catch(error => {
		  console.error("Error al eliminar las tareas:", error);
		});
	})
	.catch(error => {
	  console.error("Error al obtener las tareas:", error);
	});
  };
  

  useEffect(() => {
    crearUsuario();
    getInfoTareas();
  }, []);

  return (
	<div className="container">
	  <h1 className="text-center mt-5">Mis Tareas</h1>
	  <ul className="list-group">
		<li className="list-group-item">
		  <input
			type="text"
			value={inputValue}
			onChange={(e) => setInputValue(e.target.value)}
			onKeyDown={(e) => {
			  if (e.key === "Enter" && inputValue.trim() !== "") {
				agregarTareas(inputValue.trim());
				setInputValue("");
			  }
			}}
			placeholder="Escribe aquí tu tarea"
		  />
		</li>
		{tareas.map((item) => (
		  <li key={item.id} className="list-group-item d-flex justify-content-between">
			<span>{item.label}</span>
			<button
			  className="btn btn-danger"
			  onClick={() => eliminarTarea(item.id || index)}
			>
			  Eliminar
			</button>
		  </li>
		))}
		<li className="list-group-item text-center mt-3">
		  <button
			className="btn btn-danger"
			onClick={eliminarTodasLasTareas}
		  >
			Eliminar Todas las Tareas
		  </button>
		</li>
	  </ul>
	</div>
  );  
};

export default Home;
