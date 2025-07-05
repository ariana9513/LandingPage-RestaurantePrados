// Asegúrate de que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
  // Selecciona el botón de hamburguesa
  const toggle = document.querySelector(".menu-toggle");
  // Selecciona el menú horizontal (la lista de enlaces)
  const menu = document.querySelector(".menu-horizontal");

  // Verifica que ambos elementos existan antes de añadir el event listener
  if (toggle && menu) {
    // Al hacer clic en el botón de hamburguesa
    toggle.addEventListener("click", () => {
      // Alterna (agrega o quita) la clase "active" en el menú
      // Esto hará que el menú se muestre o se oculte
      menu.classList.toggle("active");
    });
  }
});
