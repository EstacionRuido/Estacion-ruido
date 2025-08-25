/*
    Este script requiere que la librería Leaflet esté incluida en tu HTML,
    y que exista un elemento con id="map" donde se renderizará el mapa.
*/

// Inicializa el mapa centrado en Santiago
var map = L.map('map').setView([-33.45, -70.66], 12);

// Agrega capa base OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Estaciones con ruido
var estaciones = [
    {nombre: "Hospital El Pino", ruido: 4, coord: [-33.5831105,-70.6767678]},
    {nombre: "Copa Lo Martínez", ruido: 2, coord: [-33.5708518,-70.6736254]},
    {nombre: "Observatorio", ruido: 2, coord: [-33.5612077,-70.6715591]},
    {nombre: "El Bosque", ruido: 4, coord: [-33.5459166,-70.6670512]},
    {nombre: "La Cisterna", ruido: 44, coord: [-33.53776,-70.6649461]},
    {nombre: "El Parrón", ruido: 1, coord: [-33.5255258,-70.6617033]},
    {nombre: "Lo Ovalle", ruido: 16, coord: [-33.5160447,-70.6588945]},
    {nombre: "Ciudad del Niño", ruido: 2, coord: [-33.509103,-70.65675]},
    {nombre: "Departamental", ruido: 5, coord: [-33.5023332,-70.6547847]},
    {nombre: "Lo Vial", ruido: 2, coord: [-33.4972126,-70.6534721]},
    {nombre: "San Miguel", ruido: 2, coord: [-33.4884342,-70.6515746]},
    {nombre: "El Llano", ruido: 2, coord: [-33.4825749,-70.650137]},
    {nombre: "Franklin", ruido: 44, coord: [-33.4767145,-70.6491134]},
    {nombre: "Rondizzoni", ruido: 4, coord: [-33.4704353,-70.6556618]},
    {nombre: "Parque OHiggins", ruido: 21, coord: [-33.461194,-70.6564608]},
    {nombre: "Toesca", ruido: 8, coord: [-33.4532853,-70.6587179]},
    {nombre: "Los Héroes", ruido: 72, coord: [-33.4466135,-70.6608063]},
    {nombre: "Santa Ana", ruido: 39, coord: [-33.4385261,-70.6602499]},
    {nombre: "Puente Cal y Canto", ruido: 33, coord: [-33.4327946,-70.6533353,19]},
    {nombre: "Patronato", ruido: 16, coord: [-33.4296656,-70.647011]},
    {nombre: "Cerro Blanco", ruido: 0, coord: [-33.422577,-70.644898]},
    {nombre: "Cementerios", ruido: 0, coord: [-33.413938,-70.643615]},
    {nombre: "Einstein", ruido: 1, coord: [-33.405700,-70.643140]},
    {nombre: "Dorsal", ruido: 1, coord: [-33.396807,-70.642836]},
    {nombre: "Zapadores", ruido: 4, coord: [-33.391159,-70.642463]},
    {nombre: "Vespucio Norte", ruido: 10, coord: [-33.380539,-70.646381]}
];

//Audios por estación
var sonidos = {
    "Hospital El Pino": "sonidos/hospital.mp3",
    "Copa Lo Martínez": "sonidos/copa.mp3",
    "Observatorio": "sonidos/observatorio.mp3",
    "El Bosque": "sonidos/bosque.mp3",
    "La Cisterna": "sonidos/LaCisterna.mp3",
    "El Parrón": "sonidos/ElParron.mp3",
    "Lo Ovalle": "sonidos/LoOvalle.mp3",
    "Ciudad del Niño": "sonidos/CiudadDelNiño.mp3",
    "Departamental": "sonidos/departamental.mp3",
    "Lo Vial": "sonidos/LoVial.mp3",
    "San Miguel": "sonidos/sanmiguel.mp3",
    "El Llano": "sonidos/ElLlano.mp3",
    "Franklin": "sonidos/Franklin.mp3",
    "Rondizzoni": "sonidos/Rondizzoni.mp3",
    "Parque OHiggins":"sonidos/ParqueOHiggins.mp3",
    "Toesca": "sonidos/toesca.mp3",
    "Los Héroes": "sonidos/heroes.mp3",
    "Santa Ana": "sonidos/SantaAna.mp3",
    "Puente Cal y Canto": "sonidos/cal_y_canto.mp3",
    "Patronato": "sonidos/patronato.mp3",
    "Cerro Blanco": null,
    "Cementerios": null,
    "Einstein": null,
    "Dorsal": null,
    "Zapadores": null,
    "Vespucio Norte": null
};

// Guardar audios y botones activos
var audioActual = {};     // estación → objeto Audio
var botonesActuales = {}; // estación → botón

// Función para definir color según ruido
function getColor(ruido) {
    if (ruido <= 30) return "#007990";      // Bajo
    else if (ruido <= 69) return "#ffa42e"; // Alto
    else return "#f63f3a";                   // Excesivo
}

// Función para reproducir/pausar sonido y cambiar ícono
function togglesound(estacion) {
    if (!sonidos[estacion]) {
        alert("Sonido no disponible");
        return;
    }

    var btn = botonesActuales[estacion];
    if (!btn) return;

    if (audioActual[estacion]) {
        if (!audioActual[estacion].paused) {
            audioActual[estacion].pause();
            btn.textContent = "🔊";
        } else {
            audioActual[estacion].play();
            btn.textContent = "⏸";
        }
    } else {
        var audio = new Audio(sonidos[estacion]);
        audio.play().catch(err => console.error(err));
        audioActual[estacion] = audio;
        btn.textContent = "⏸";
        audio.onended = function() {
            btn.textContent = "🔊";
        };
    }
}

// Agregar marcadores de estaciones
estaciones.forEach(est => {
    L.circleMarker(est.coord, {
        radius: 8,
        fillColor: getColor(est.ruido),
        color: "#0f1065ff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map)
    .bindPopup(function() {
        var btnId = "btn-" + est.nombre.replace(/\s+/g, "_");
        setTimeout(function() {
            var btn = document.getElementById(btnId);
            if (btn) {
                botonesActuales[est.nombre] = btn;
                btn.onclick = function() { togglesound(est.nombre); };
            }
        }, 100);
        return "<b>" + est.nombre + "</b><br>Ruido percibido: " + est.ruido + "%" +
            "<br><br>" +
            "<button id='" + btnId + "'>🔊</button>";
    });
});

function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(sec => {
    sec.classList.remove('activa'); // oculta todo
  });
  document.getElementById(id).classList.add('activa'); // muestra la sección que corresponde
}

// Seleccionamos elementos
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const cerrar = document.querySelector('.cerrar');

// Abrir lightbox al hacer clic en la imagen
document.querySelectorAll('.clickeable').forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
  });
});

// Cerrar lightbox al hacer clic en la X
cerrar.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// Cerrar lightbox al hacer clic fuera de la imagen
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.style.display = 'none';
});





