# INFORME DE ENTREGA DE PROYECTO | MÓDULO #2 ABP
## Alke Wallet - Frontend Digital Fintech

- **Estudiante**: Sebastián Sánchez
- **Correo Institucional / Git**: `se.sancheza@duocuc.cl`
- **Institución / Bootcamp**: Duoc UC / Alkemy
- **Módulo**: #2 - Fundamentos del desarrollo Front-end
- **Fecha de Entrega**: Septiembre 2026
- **Enlace al Repositorio de GitHub**: https://github.com/SebastianSanchez2023/alke-wallet
- **Demostración en Vivo (GitHub Pages)**: https://SebastianSanchez2023.github.io/alke-wallet/

---

### 1. Resumen Ejecutivo y Problemática

El equipo de desarrollo ha diseñado e implementado la interfaz de usuario de **Alke Wallet**, una plataforma digital pensada para ofrecer a los usuarios una alternativa segura, intuitiva y moderna para administrar activos financieros digitales. 

La problemática abordada radica en brindar una experiencia fluida que combine:
1. Autenticación y registro seguro.
2. Consulta de saldo en tiempo real y administración integral de fondos (depósitos y retiros).
3. Transferencias instantáneas con autocompletado y agenda de contactos.
4. Historial transaccional auditable con filtros por tipo de movimiento.

---

### 2. Decisiones Técnicas y Fundamentación de Arquitectura

| Aspecto | Tecnología / Solución | Fundamentación Técnica |
| :--- | :--- | :--- |
| **Estructura** | HTML5 Semántico | Uso de etiquetas `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<form>` y `<footer>` para garantizar accesibilidad, indexabilidad y orden en el árbol DOM. |
| **Diseño y UI** | Bootstrap 5.3.3 + CSS Vanilla | Se utilizó el sistema de grillas de 12 columnas y componentes nativos de Bootstrap (Navbar responsive, Modales, Badges, Botones) combinados con una hoja de estilos personalizada (`css/styles.css`) con degradados, tipografía Google Fonts (Inter) y variables CSS para lograr una identidad fintech moderna. |
| **Interactividad** | jQuery 3.7.1 | Facilita la manipulación del DOM, el autocompletado predictivo en la búsqueda de contactos, las animaciones de feedback visual (`slideDown`, `fadeIn`, `fadeOut`) y la gestión de eventos de formularios. |
| **Persistencia de Estado** | LocalStorage API (`js/wallet-state.js`) | Permite que todas las vistas (`menu.html`, `deposit.html`, `sendmoney.html`, `transactions.html`) compartan y sincronicen el saldo, nuevos contactos y el historial de transacciones sin requerir un servidor backend en esta etapa formativa. |

---

### 3. Matriz de Requerimientos y Pantallas Implementadas

1. **`index.html` (Landing de Entrada)**:
   - Presentación de la propuesta de valor de Alke Wallet.
   - Vista previa interactiva de la tarjeta de saldo.
   - Navegación clara hacia el inicio de sesión y el panel de control.
2. **`login.html` & `register.html` (Autenticación y Registro)**:
   - Formularios con validación en tiempo real (longitud de contraseña, formato de correo).
   - Bloque de credenciales demo preconfiguradas para agilizar la evaluación (`seba@alkewallet.com` / `123456`).
3. **`menu.html` (Dashboard Principal)**:
   - Barra de navegación responsive con menú colapsable y cierre de sesión.
   - Tarjetas de resumen financiero (saldo total, ingresos y egresos del mes).
   - Accesos rápidos a acciones frecuentes y modal con código QR.
   - Vista previa dinámica de las transacciones más recientes.
4. **`deposit.html` (Administración de Fondos: Depósitos y Retiros)**:
   - Selector rápido con botones tipo pill (+10.000, +25.000, +50.000, etc.).
   - Cálculo en vivo del saldo proyectado.
   - Pestaña para retiros bancarios a cuentas externas.
5. **`sendmoney.html` (Transferencias y Contactos)**:
   - Búsqueda inteligente con autocompletado en vivo mediante jQuery.
   - Selector de contactos frecuentes.
   - Modal Bootstrap para dar de alta nuevos destinatarios.
   - Validación de saldo suficiente antes de transferir.
6. **`transactions.html` (Historial y Auditoría)**:
   - Tabla con identificadores, categorías, fechas y montos con colores según flujo (+ verde, - rojo).
   - Filtros instantáneos por tipo (*Todos*, *Ingresos*, *Egresos*).
   - Buscador por texto predictivo y función de impresión/exportación.

---

### 4. Flujo de Control de Versiones con Git y GitHub

Siguiendo las buenas prácticas de la **Lección 7**, el proyecto se organiza bajo la siguiente estructura de ramas:
- `main`: Código estable de producción listo para despliegue.
- `feature/login`: Implementación de formularios de acceso y registro.
- `feature/transacciones`: Módulos de transferencias, autocompletado y contactos.
- `feature/depositos`: Módulo de depósitos, retiros y saldo dinámico.

---

### 5. Conclusiones y Aprendizajes

El desarrollo de **Alke Wallet** permitió consolidar los fundamentos de Front-End, demostrando cómo una integración equilibrada de HTML semántico, estilos responsivos con Bootstrap y programación interactiva con jQuery puede dar vida a un prototipo fintech comercialmente viable, accesible y listo para formar parte del portafolio profesional.
