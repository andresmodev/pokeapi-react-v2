# 🧠 PokeDev 2 — Pokédex profesional con React

**PokeDev 2** es una aplicación web responsiva construida con React que permite explorar Pokémon de forma paginada y realizar búsquedas por nombre. El proyecto fue desarrollado como parte de mi proceso de aprendizaje práctica en frontend, con énfasis en arquitectura limpia, accesibilidad y experiencia de usuario. El proyecto tiene una versión 1 en la cual el enfoque era netamente consumir la API y la funcionalidad a diferencia de esta versión 2 que no solo busca la funcionalidad sino dividir responsabilidades para que le proyecto pueda ser escalable.

_versión 1_

- [andresmodev](https://github.com/andresmodev/pokeapi-react-v1)

---

## 🚀 Funcionalidades principales

- 🔍 Búsqueda por nombre con debounce y normalización.
- 📄 Paginación dinámica con ventana inteligente y puntos suspensivos.
- ⚡ Lazy loading de descripciones para evitar sobrecarga de peticiones.
- 🧠 Prefetch de páginas siguientes para mejorar la percepción de velocidad.
- 🧩 Componentes reutilizables y desacoplados.
- 📱 Diseño responsivo para móviles y pantallas pequeñas.
- 🧼 Manejo de errores y loading con componentes dedicados.
- 🧠 Cache persistente para evitar re-fetch innecesario.

---

## 🛠️ Tecnologías utilizadas

- React con hooks personalizados (usePokemons, usePokemonSpecies)
- CSS Modules para estilos encapsulados
- Fetch API con AbortController para control de peticiones
- PokeAPI como fuente de datos
- Vite como bundler para desarrollo rápido

---

## 🎯 Objetivos logrados

- ✅ Lógica y arquitectura
- ✅ Separación clara entre lógica de datos y presentación.
- ✅ Hook principal usePokemons con soporte para paginación y búsqueda.
- ✅ Normalización de datos para simplificar el renderizado.
- ✅ Prefetch y cache para optimizar rendimiento.

---

## 🎨 Maquetación y estilos

Diseño limpio y accesible.

Uso de roles ARIA y etiquetas semánticas.

Componente SearchInput con debounce manual y accesibilidad.

Componente Pagination con lógica inteligente para mostrar solo las páginas necesarias.

---

## 📱 Responsividad

Layout adaptable a pantallas móviles.

Comportamiento fluido en dispositivos táctiles.

Botones accesibles y legibles en todas las resoluciones.

---

## 📦 Instalación y ejecución local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/pokedev2.git
cd pokedev2

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

---

## 🌐 Despliegue

La aplicación será desplegada en Vercel, con URL pública disponible próximamente.

- [Deploy](https://pokeapi-react-v2.vercel.app/)

---

## 🎨 Créditos

- Iconos de tipos de Pokémon por [duiker101](https://duiker101.github.io/pokemon-type-svg-icons/index.html)

---

## 👨‍💻 Autor

- [andresmodev](https://github.com/andresmodev/pokeapi-react-v2)
