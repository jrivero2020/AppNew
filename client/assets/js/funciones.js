$(document).ready(function () {

    // Scroll Suave ( smooth scroll.)
    $(".scrollSuave ul a").on("click", function (e) {
        e.preventDefault();
        const href = $(this).attr("href");
        $("html, body").animate({ scrollTop: $(href).offset().top }, 1200);
    });


    // Funciones bootstrap jquery
    // PopOver
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {return new bootstrap.Popover(popoverTriggerEl) })
    
    // toolTips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    


}
);

// Función que coloca background a barra
// de navegación cuando la página hace scroll
// quita backgroud cuando está al comienzo
let nav = document.querySelector('nav');

window.addEventListener('scroll', function () {
  if (window.pageYOffset > 100) {
    nav.classList.add('bg-info', 'shadow');
  } else {
    nav.classList.remove('bg-info', 'shadow');
  }
});

