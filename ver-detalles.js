// --- Lógica de los Pop-ups de Detalles de Buffet ---
// Definición de los detalles de cada buffet
const buffetDetailsContent = {
  "amanecer-criollo": {
    title: "El Amanecer Criollo",
    content: `
        <h4>Estación de Sanguches Peruanos:</h4>
        <ul>
          <li>Pan con chicharrón (con camote frito y salsa criolla)</li>
          <li>Pan con jamón del país</li>
          <li>Pan con huevo revuelto y salchicha huachana</li>
        </ul>
        <h4>Platos Calientes:</h4>
        <ul>
          <li>Tamales criollos (pollo y cerdo)</li>
          <li>Salchipapa con huevo frito</li>
          <li>Caldo de gallina (opcional, para mañanas frías)</li>
        </ul>
        <h4>Guarniciones:</h4>
        <ul>
          <li>Camote frito</li>
          <li>Yuca frita</li>
          <li>Salsa criolla fresca</li>
        </ul>
        <h4>Bebidas:</h4>
        <ul>
          <li>Café pasado (ilimitado)</li>
          <li>Infusiones variadas (té, anís, manzanilla)</li>
          <li>Jugo de naranja natural</li>
          <li>Chicha morada</li>
        </ul>
        <h4>Dulces Tradicionales:</h4>
        <ul>
          <li>Picarones con miel de chancaca</li>
          <li>Arroz con leche y mazamorra morada</li>
          <li>Frutas de estación</li>
        </ul>
      `,
  },
  "despertar-continental": {
    title: "Despertar Continental",
    content: `
        <h4>Panadería y Bollería:</h4>
        <ul>
          <li>Variedad de panes artesanales (blanco, integral, multigrano)</li>
          <li>Croissants, medialunas y muffins</li>
          <li>Tostadas francesas con sirope de maple</li>
        </ul>
        <h4>Estación de Fríos:</h4>
        <ul>
          <li>Tabla de quesos (gouda, edam, fresco) y embutidos (jamón, pavo)</li>
          <li>Cereales (avena, corn flakes, granola) con leche y yogur</li>
          <li>Frutas frescas de temporada (papaya, melón, piña, uvas)</li>
          <li>Ensalada de frutas</li>
        </ul>
        <h4>Opciones Calientes:</h4>
        <ul>
          <li>Huevos revueltos, fritos o escalfados (preparados al momento)</li>
          <li>Tocino crujiente y salchichas de desayuno</li>
          <li>Pancakes y waffles con variedad de toppings (miel, mermeladas, crema batida)</li>
        </ul>
        <h4>Bebidas:</h4>
        <ul>
          <li>Café americano y espresso (ilimitado)</li>
          <li>Selección de tés</li>
          <li>Jugos naturales (naranja, piña, fresa)</li>
          <li>Agua fresca</li>
        </ul>
        <h4>Extras:</h4>
        <ul>
          <li>Mantequilla, mermeladas caseras, miel</li>
          <li>Frutos secos y semillas</li>
        </ul>
      `,
  },
  "brunch-dominical": {
    title: "Brunch Dominical",
    content: `
        <h4>Estación de Omelettes y Huevos al Gusto:</h4>
        <ul>
          <li>Preparados al momento con ingredientes a elección (queso, champiñones, espinacas, jamón, pimiento)</li>
        </ul>
        <h4>Mini Platos Calientes:</h4>
        <ul>
          <li>Mini quiches lorraine</li>
          <li>Mini hamburguesas de desayuno</li>
          <li>Brochetas de pollo y vegetales</li>
          <li>Papas rostizadas con hierbas</li>
        </ul>
        <h4>Selección de Mariscos y Ensaladas:</h4>
        <ul>
          <li>Ceviche de pescado (porciones pequeñas)</li>
          <li>Ensalada Caprese (tomate, mozzarella, albahaca)</li>
          <li>Ensalada de quinua con vegetales</li>
        </ul>
        <h4>Panadería y Postres Finos:</h4>
        <ul>
          <li>Variedad de panes gourmet y mini sándwiches</li>
          <li>Mini postres individuales (tartaletas de frutas, mousses, brownies)</li>
          <li>Mesa de crepes con rellenos dulces y salados</li>
        </ul>
        <h4>Bebidas Premium:</h4>
        <ul>
          <li>Café de especialidad (variedades)</li>
          <li>Mimosa (jugo de naranja y espumante)</li>
          <li>Smoothies de frutas naturales</li>
          <li>Agua saborizada (pepino y menta, frutos rojos)</li>
        </ul>
        <h4>Estación de Frutas Exóticas:</h4>
        <ul>
          <li>Variedad de frutas tropicales y de estación, cortadas y listas para consumir.</li>
        </ul>
      `,
  },
};

// Elementos del modal
const detallesModal = document.getElementById("detallesModal");
const modalCloseButton = detallesModal.querySelector(".modal-close-button");
const modalTitle = detallesModal.querySelector(".modal-title");
const modalDetailsContent = detallesModal.querySelector(
  ".modal-details-content"
);
const detallesButtons = document.querySelectorAll(".detalles-button"); // Todos los botones "Ver detalles"

// Función para abrir el modal
function openModal(buffetId) {
  const details = buffetDetailsContent[buffetId];
  if (details) {
    modalTitle.textContent = details.title;
    modalDetailsContent.innerHTML = details.content;
    detallesModal.classList.add("active"); // Activa la visibilidad y transiciones
    document.body.style.overflow = "hidden"; // Evita el scroll del body cuando el modal está abierto
  }
}

// Función para cerrar el modal
function closeModal() {
  detallesModal.classList.remove("active");
  document.body.style.overflow = ""; // Restaura el scroll del body
}

// Escuchadores de eventos para los botones "Ver detalles"
detallesButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const buffetId = event.target.dataset.buffetId; // Obtiene el ID del buffet del atributo data-
    openModal(buffetId);
  });
});

// Escuchador de eventos para el botón de cierre del modal
modalCloseButton.addEventListener("click", closeModal);

// Escuchador de eventos para cerrar el modal haciendo clic fuera de él
detallesModal.addEventListener("click", (event) => {
  if (event.target === detallesModal) {
    // Si el clic es directamente en el overlay
    closeModal();
  }
});
