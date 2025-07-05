// --- Lógica de la Sección Registrar Reservas ---

// Lista global para almacenar las reservas
let reservas = [];

// Elementos del calendario
const calendarDaysGrid = document.getElementById("calendarDaysGrid");
const currentMonthYearSpan = document.getElementById("currentMonthYear");
const prevMonthArrow = document.getElementById("prevMonth");
const nextMonthArrow = document.getElementById("nextMonth");
const fechaSeleccionadaInput = document.getElementById("fechaSeleccionada"); // Campo oculto
const mensajeReservaDiv = document.getElementById("mensajeReserva"); // Div para el mensaje de éxito
const reservaTitulo = document.getElementById("reservaTitulo"); // Título "Tu Reserva:"
const countdownMessageDiv = document.getElementById("countdownMessage"); // Mensaje de cuenta regresiva
const countdownTimerSpan = document.getElementById("countdownTimer"); // Span del contador

// Elementos para mostrar los detalles de la reserva
const reservaFechaSpan = document.getElementById("reservaFecha");
const displayReservaHoraSpan = document.getElementById("displayReservaHora");
const reservaPersonasSpan = document.getElementById("reservaPersonas");
const reservaConsumoSpan = document.getElementById("reservaConsumo");

// Elementos del cuadro de comentarios
const comentarioReservaTextarea = document.getElementById("comentarioReserva");
const enviarComentarioBtn = document.getElementById("enviarComentarioBtn");
const mensajeComentarioExitoSpan = document.getElementById(
  "mensajeComentarioExito"
);

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null; // Para almacenar la fecha seleccionada por el usuario
let countdownInterval; // Variable para almacenar el ID del intervalo del contador

// Función para renderizar el calendario
function renderCalendar() {
  // Limpiar días anteriores y añadir etiquetas de día
  calendarDaysGrid.innerHTML = `
    <span class="day-label">Lun</span>
    <span class="day-label">Mar</span>
    <span class="day-label">Mie</span>
    <span class="day-label">Jue</span>
    <span class="day-label">Vie</span>
    <span class="day-label">Sáb</span>
    <span class="day-label">Dom</span>
  `;

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Ajustar el día de inicio de la semana (Lunes es 0, Martes es 1, etc.)
  // getDay() devuelve 0 para Domingo, 1 para Lunes, ..., 6 para Sábado
  let startingDay = firstDayOfMonth.getDay();
  if (startingDay === 0) {
    // Si es Domingo, ajustar a 6 para el final de la semana
    startingDay = 6;
  } else {
    // Para otros días, restar 1 para que Lunes sea 0
    startingDay--;
  }

  // Rellenar días vacíos al principio del mes
  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("span");
    emptyDay.classList.add("day", "empty");
    calendarDaysGrid.appendChild(emptyDay);
  }

  // Rellenar los días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const daySpan = document.createElement("span");
    daySpan.classList.add("day");
    daySpan.textContent = day;
    daySpan.dataset.day = day; // Almacenar el día en un atributo de datos

    // Marcar el día si ya está seleccionado
    if (
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    ) {
      daySpan.classList.add("selected");
    }

    daySpan.addEventListener("click", () => {
      // Eliminar la clase 'selected' de cualquier día previamente seleccionado
      const previouslySelected =
        calendarDaysGrid.querySelector(".day.selected");
      if (previouslySelected) {
        previouslySelected.classList.remove("selected");
      }
      // Añadir la clase 'selected' al día clicado
      daySpan.classList.add("selected");
      // Guardar la fecha seleccionada
      selectedDate = new Date(currentYear, currentMonth, day);
      fechaSeleccionadaInput.value = selectedDate.toDateString(); // Formato legible para depuración
      // Limpiar mensaje de error de fecha al seleccionar
      clearError("fechaSeleccionada");
    });
    calendarDaysGrid.appendChild(daySpan);
  }

  // Actualizar el mes y el año en el encabezado
  currentMonthYearSpan.textContent = new Date(
    currentYear,
    currentMonth
  ).toLocaleString("es-ES", { month: "long", year: "numeric" });
}

// Escuchadores de eventos para las flechas del calendario
prevMonthArrow.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

nextMonthArrow.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

// Renderizar el calendario cuando la página carga
renderCalendar();

// Función para iniciar el contador regresivo
function startCountdown(durationMinutes) {
  let timer = durationMinutes * 60; // Convertir minutos a segundos
  clearInterval(countdownInterval); // Limpiar cualquier intervalo anterior

  countdownInterval = setInterval(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    countdownTimerSpan.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (timer <= 0) {
      clearInterval(countdownInterval);
      resetFormAndDisplay(); // Resetear todo cuando el contador llega a cero
    }
    timer--;
  }, 1000); // Actualizar cada segundo
}

// Función para resetear el formulario y la visualización del cuadro de reserva
function resetFormAndDisplay() {
  document.getElementById("reservaForm").reset();
  selectedDate = null; // Deseleccionar fecha
  renderCalendar(); // Volver a renderizar para limpiar la selección
  fechaSeleccionadaInput.value = ""; // Limpiar campo oculto

  // Ocultar mensaje de reserva y contador
  mensajeReservaDiv.style.display = "none";
  countdownMessageDiv.style.display = "none";

  // Limpiar todos los mensajes de error
  document.querySelectorAll(".error-message").forEach((span) => {
    span.textContent = "";
  });

  // Resetear el campo de comentario y el botón
  comentarioReservaTextarea.value = "";
  enviarComentarioBtn.disabled = true;
  mensajeComentarioExitoSpan.style.display = "none";
}

// Función para mostrar mensajes de error debajo de cada campo
function displayError(elementId, message) {
  const errorSpan = document.getElementById(
    `error${elementId.charAt(0).toUpperCase() + elementId.slice(1)}`
  );
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
  }
}

// Función para limpiar un mensaje de error específico
function clearError(elementId) {
  const errorSpan = document.getElementById(
    `error${elementId.charAt(0).toUpperCase() + elementId.slice(1)}`
  );
  if (errorSpan) {
    errorSpan.textContent = "";
    errorSpan.style.display = "none";
  }
}

// Función para validar email
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]/;
  return re.test(String(email).toLowerCase());
}

// Función para validar número de teléfono (solo 9 dígitos)
function validatePhoneNumber(phone) {
  const re = /^\d{9}$/; // Acepta exactamente 9 dígitos (0-9)
  return re.test(String(phone));
}

// Evento para el envío del formulario de reserva
const reservaForm = document.getElementById("reservaForm");
reservaForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevenir el envío real del formulario

  // Limpiar todos los mensajes de error antes de validar
  document.querySelectorAll(".error-message").forEach((span) => {
    span.textContent = "";
  });

  let isValid = true;

  // Obtener datos del formulario
  const cantidadPersonas = document.getElementById("cantidadPersonas").value;
  const horaReserva = document.getElementById("horaReserva").value;
  const tipoConsumo = document.getElementById("tipoConsumo").value;
  const nombreReserva = document.getElementById("nombreReserva").value.trim();
  const apellidoReserva = document
    .getElementById("apellidoReserva")
    .value.trim();
  const emailReserva = document.getElementById("emailReserva").value.trim();
  const telefonoReserva = document
    .getElementById("telefonoReserva")
    .value.trim();
  const aceptoTerminos = document.getElementById("aceptoTerminos").checked;

  // Validaciones y mostrar mensajes de error
  if (!cantidadPersonas) {
    displayError(
      "cantidadPersonas",
      "Por favor, elige la cantidad de personas."
    );
    isValid = false;
  }
  if (!selectedDate) {
    displayError("fechaSeleccionada", "Por favor, selecciona una fecha.");
    isValid = false;
  }
  if (!horaReserva) {
    displayError("horaReserva", "Por favor, ingresa la hora de reserva.");
    isValid = false;
  }
  if (!tipoConsumo) {
    displayError("tipoConsumo", "Por favor, selecciona un tipo de consumo.");
    isValid = false;
  }
  if (!nombreReserva) {
    displayError("nombreReserva", "Por favor, ingresa tu nombre.");
    isValid = false;
  }
  if (!apellidoReserva) {
    displayError("apellidoReserva", "Por favor, ingresa tus apellidos.");
    isValid = false;
  }
  if (!emailReserva) {
    displayError("emailReserva", "Por favor, ingresa tu correo electrónico.");
    isValid = false;
  } else if (!validateEmail(emailReserva)) {
    displayError(
      "emailReserva",
      "Por favor, ingresa un correo electrónico válido."
    );
    isValid = false;
  }
  if (!telefonoReserva) {
    displayError("telefonoReserva", "Por favor, ingresa tu teléfono.");
    isValid = false;
  } else if (!validatePhoneNumber(telefonoReserva)) {
    // Nueva validación para el teléfono
    displayError(
      "telefonoReserva",
      "Por favor, ingresa un número de teléfono válido de 9 dígitos."
    );
    isValid = false;
  }
  if (!aceptoTerminos) {
    displayError("aceptoTerminos", "Debes aceptar los términos y condiciones.");
    isValid = false;
  }

  if (!isValid) {
    return; // Detener el envío si hay errores de validación
  }

  // Confirmación (reemplazando alert/confirm)
  showConfirmationDialog("¿Deseas confirmar tu reserva?", () => {
    // Si el usuario confirma
    const nuevaReserva = {
      id: Date.now(), // ID único para la reserva
      cantidadPersonas,
      fecha: selectedDate.toDateString(),
      hora: horaReserva, // La hora se obtiene directamente del input
      tipoConsumo,
      nombre: nombreReserva,
      apellido: apellidoReserva,
      email: emailReserva,
      telefono: telefonoReserva,
      aceptoTerminos,
      aceptoComunicaciones: document.getElementById("aceptoComunicaciones")
        .checked,
    };

    reservas.push(nuevaReserva);
    console.log("Reserva guardada:", reservas); // Para depuración

    // Mostrar mensaje de éxito en el cuadro de reserva
    mensajeReservaDiv.style.display = "block";
    countdownMessageDiv.style.display = "block";

    // Rellenar los detalles de la reserva
    reservaFechaSpan.textContent = selectedDate.toLocaleDateString("es-ES");
    displayReservaHoraSpan.textContent = horaReserva; // Usar el nuevo span para mostrar la hora
    reservaPersonasSpan.textContent = cantidadPersonas;
    reservaConsumoSpan.textContent = tipoConsumo;

    // Iniciar el contador regresivo de 5 minutos
    startCountdown(3);
  });
});

// Event listener para el textarea del comentario
comentarioReservaTextarea.addEventListener("input", () => {
  // Habilitar o deshabilitar el botón de enviar según si hay texto en el textarea
  enviarComentarioBtn.disabled =
    comentarioReservaTextarea.value.trim().length === 0;
  // Ocultar el mensaje de éxito si el usuario empieza a escribir de nuevo
  mensajeComentarioExitoSpan.style.display = "none";
});

// Event listener para el botón de enviar comentario
enviarComentarioBtn.addEventListener("click", () => {
  const comentario = comentarioReservaTextarea.value.trim();
  if (comentario.length > 0) {
    console.log("Comentario enviado:", comentario); // Para depuración

    // Mostrar mensaje de éxito
    mensajeComentarioExitoSpan.textContent = "¡Comentario enviado con éxito!";
    mensajeComentarioExitoSpan.style.display = "block";

    // Limpiar el textarea y deshabilitar el botón
    comentarioReservaTextarea.value = "";
    enviarComentarioBtn.disabled = true;

    // Opcional: Ocultar el mensaje de éxito después de unos segundos
    setTimeout(() => {
      mensajeComentarioExitoSpan.style.display = "none";
    }, 5000); // Ocultar después de 5 segundos
  }
});

// Función para mostrar mensajes de error/éxito (reemplazo de alert)
function showMessage(message, type = "info") {
  const dialogBox = document.createElement("div");
  dialogBox.classList.add("custom-dialog-box");
  dialogBox.innerHTML = `
    <p>${message}</p>
    <button class="dialog-ok-button">OK</button>
  `;
  document.body.appendChild(dialogBox);

  const okButton = dialogBox.querySelector(".dialog-ok-button");
  okButton.addEventListener("click", () => {
    dialogBox.remove();
  });

  // Estilos básicos para la caja de diálogo
  dialogBox.style.position = "fixed";
  dialogBox.style.top = "50%";
  dialogBox.style.left = "50%";
  dialogBox.style.transform = "translate(-50%, -50%)";
  dialogBox.style.backgroundColor = type === "error" ? "#ffe6e6" : "#e0f7fa";
  dialogBox.style.border =
    type === "error" ? "1px solid #f44336" : "1px solid #2196F3";
  dialogBox.style.padding = "20px";
  dialogBox.style.borderRadius = "8px";
  dialogBox.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  dialogBox.style.zIndex = "1000";
  dialogBox.style.textAlign = "center";
  dialogBox.style.fontFamily = "Lexend, sans-serif";

  okButton.style.marginTop = "15px";
  okButton.style.padding = "8px 15px";
  okButton.style.border = "none";
  okButton.style.borderRadius = "5px";
  okButton.style.backgroundColor = type === "error" ? "#f44336" : "#2196F3";
  okButton.style.color = "white";
  okButton.style.cursor = "pointer";
}

// Función para mostrar diálogo de confirmación (reemplazo de confirm)
function showConfirmationDialog(message, onConfirm) {
  const dialogBox = document.createElement("div");
  dialogBox.classList.add("custom-dialog-box");
  dialogBox.innerHTML = `
    <p>${message}</p>
    <button class="dialog-confirm-button">Sí</button>
    <button class="dialog-cancel-button">No</button>
  `;
  document.body.appendChild(dialogBox);

  const confirmButton = dialogBox.querySelector(".dialog-confirm-button");
  const cancelButton = dialogBox.querySelector(".dialog-cancel-button");

  confirmButton.addEventListener("click", () => {
    dialogBox.remove();
    onConfirm();
  });

  cancelButton.addEventListener("click", () => {
    dialogBox.remove();
  });

  // Estilos básicos para la caja de diálogo
  dialogBox.style.position = "fixed";
  dialogBox.style.top = "50%";
  dialogBox.style.left = "50%";
  dialogBox.style.transform = "translate(-50%, -50%)";
  dialogBox.style.backgroundColor = "#fff";
  dialogBox.style.border = "1px solid #ccc";
  dialogBox.style.padding = "20px";
  dialogBox.style.borderRadius = "8px";
  dialogBox.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  dialogBox.style.zIndex = "1000";
  dialogBox.style.textAlign = "center";
  dialogBox.style.fontFamily = "Lexend, sans-serif";

  confirmButton.style.marginTop = "15px";
  confirmButton.style.marginRight = "10px";
  confirmButton.style.padding = "8px 15px";
  confirmButton.style.border = "none";
  confirmButton.style.borderRadius = "5px";
  confirmButton.style.backgroundColor = "#4CAF50";
  confirmButton.style.color = "white";
  confirmButton.style.cursor = "pointer";

  cancelButton.style.marginTop = "15px";
  cancelButton.style.padding = "8px 15px";
  cancelButton.style.border = "none";
  cancelButton.style.borderRadius = "5px";
  cancelButton.style.backgroundColor = "#f44336";
  cancelButton.style.color = "white";
  cancelButton.style.cursor = "pointer";
}
