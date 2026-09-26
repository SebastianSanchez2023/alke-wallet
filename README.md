# 💳 Alke Wallet - Frontend Digital Fintech

Bienvenido al repositorio de **Alke Wallet**, una solución de billetera digital moderna, responsiva e interactiva desarrollada como Proyecto Integrador del **Módulo #2: Fundamentos del desarrollo Front-end (Alkemy)**.

---

## 📌 1. Situación Inicial y Objetivo del Proyecto

- **Unidad solicitante**: Equipo de desarrollo de empresa Fintech.
- **Problemática**: Brindar a los usuarios una solución segura y fácil de usar para administrar sus activos financieros de manera digital.
- **Propósito**: Proveer una vista interactiva, visualmente atractiva y funcional que permita a los usuarios iniciar sesión, consultar su saldo en tiempo real, recargar fondos, transferir dinero a contactos agendados y auditar un historial completo de movimientos.

---

## 🚀 2. Tecnologías Utilizadas

- **HTML5 Semántico**: Estructura accesible (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3 Personalizado (`css/styles.css`)**:
  - Paleta de colores corporativa fintech (azul marino profundo, esmeralda, cian neón).
  - Tipografía moderna mediante **Google Fonts (Inter)**.
  - Efectos visuales de sombreado suave, glassmorphism y micro-interacciones.
- **Bootstrap 5.3.3**:
  - Grid responsivo (sistema de 12 columnas).
  - Componentes nativos: Navbar colapsable, Cards financieras, Modales dinámicos, Badges, Botones y Formularios flotantes.
- **Bootstrap Icons 1.11.3**: Iconografía vectorial bancaria y transaccional.
- **JavaScript ES6+ & jQuery 3.7.1**:
  - Manipulación eficiente del DOM y manejo de eventos.
  - Persistencia de datos en el navegador con `localStorage` (`js/wallet-state.js`).
  - Animaciones y transiciones suaves (`fadeIn`, `fadeOut`, `slideDown`).
  - Autocompletado interactivo en el buscador de contactos para transferencias.
  - Actualización reactiva del saldo en todas las vistas sin recargas forzadas.

---

## 📂 3. Estructura del Proyecto

```text
alke-wallet/
├── index.html            # Landing page de bienvenida y presentación general
├── login.html            # Pantalla de inicio de sesión con validación de credenciales
├── menu.html             # Menú principal / Dashboard con resumen financiero
├── deposit.html          # Pantalla para realizar depósitos y acreditación de saldo
├── sendmoney.html        # Pantalla de transferencias con autocompletado y modal de contacto
├── transactions.html     # Historial de últimos movimientos con filtros en tiempo real
├── css/
│   └── styles.css        # Sistema de diseño fintech responsivo
├── js/
│   ├── wallet-state.js   # Manejador de estado, saldo, contactos y localStorage
│   └── app.js            # Lógica interactiva con jQuery, autocompletado y eventos
├── assets/               # Recursos multimedia y gráficos
└── README.md             # Documentación técnica del proyecto
```

---

## 👣 4. Cumplimiento de Requerimientos por Lección

| Lección | Objetivo | Implementación en Alke Wallet |
| :--- | :--- | :--- |
| **Lección 1: Arquitectura Web** | Estructura de archivos y flujo de pantallas | Definición clara de carpetas, punto de entrada `index.html`, navegación unificada en `login.html` y `menu.html`. |
| **Lección 2: Lenguaje HTML** | Semántica, formularios y accesibilidad | Formularios con validación en `login.html`, `deposit.html` y `sendmoney.html`, etiquetas semánticas y contenedores para contactos e historial. |
| **Lección 3: Estilos y CSS** | Responsividad y paleta fintech | `css/styles.css` con variables CSS, tipografía Inter, tarjetas con sombras fluidas, badges de estado y diseño adaptable a móviles y desktop. |
| **Lección 4: Bootstrap** | Componentes y fluidez | Barra de navegación responsive colapsable, tarjetas financieras, modales (`#addContactModal`, `#infoModal`), grid dinámico. |
| **Lección 5: JavaScript** | Lógica de negocio y saldo | Validación de login, cálculo de saldo disponible, funciones `depositFunds()` y `sendFunds()`, generación de ID de transacción. |
| **Lección 6: jQuery** | Manipulación del DOM y UX | Autocompletado reactivo en campo "Buscar Contacto", renderizado dinámico de transacciones, transiciones animadas y selector de montos rápidos. |
| **Lección 7: Git & GitHub** | Control de versiones y ramas | Plan de ramas estructurado (`main`, `feature/login`, `feature/transacciones`, `feature/depositos`). |

---

## 🧪 5. Credenciales y Pruebas en Vivo

Para facilitar la evaluación de la plataforma:
- **Correo demo**: `seba@alkewallet.com`
- **Contraseña demo**: `123456`
- **Saldo inicial de prueba**: `$1.450.000 CLP`
- **Restablecimiento**: Cualquier vista cuenta con un botón en el pie de página para *Restaurar datos demo* a su estado inicial.

---

## 🌿 6. Guía de Ramas para Git y GitHub (Lección 7)

Para subir el proyecto a tu cuenta de GitHub con la estructura de ramas requerida por la consigna:

```bash
# 1. Ubicarse en la carpeta del proyecto
cd C:\Users\Seba\.gemini\antigravity-ide\scratch\alke-wallet

# 2. Inicializar el repositorio Git
git init
git add .
git commit -m "feat: estructura base y vistas principales de Alke Wallet"

# 3. Crear ramas de funcionalidades
git branch feature/login
git branch feature/transacciones
git branch feature/depositos

# 4. Vincular con tu repositorio en GitHub
git remote add origin https://github.com/SebastianSanchez2023/alke-wallet.git
git branch -M main
git push -u origin main

# 5. Subir las ramas correspondientes
git push origin feature/login
git push origin feature/transacciones
git push origin feature/depositos
```

---

## 👨‍💻 Autor
- **Estudiante**: Sebastián Sánchez
- **Contacto / Git**: `se.sancheza@duocuc.cl`
- **Proyecto**: Alke Wallet - Evaluación Integradora Módulo #2 Front-End (Alkemy / Duoc UC).
