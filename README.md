# 🏥 Medical Appointment System
Sistema web de gestión de citas médicas — SPA con Spring Boot y React.

## 📌 Descripción General
Medical Appointment System es una aplicación web tipo Single Page Application (SPA) diseñada para gestionar citas médicas en línea.
Permite a pacientes buscar médicos por especialidad y ubicación, visualizar horarios disponibles y reservar citas fácilmente.

El sistema integra tres tipos de usuarios:
- Pacientes
- Médicos
- Administrador

Cada uno cuenta con distintas funcionalidades específicas basadas en roles, gestionadas mediante autenticación JWT.

Incluye:
- Registro y login de médicos y pacientes
- Gestión de horarios de atención
- Búsqueda de médicos y espacios disponibles
- Reservas de citas médicas
- Aprobación de médicos por parte del administrador
- Histórico de citas
- SPA React completamente dinámica
- API REST con Spring Boot + MySQL
- Subida y visualización de fotos de perfil

## ✨ Características Principales

✔️ Búsqueda de médicos por especialidad y ubicación  
✔️ Visualización de espacios disponibles por día/hora  
✔️ Registro y aprobación de médicos  
✔️ Gestión de horarios semanales y frecuencia de citas  
✔️ Confirmación, cancelación y finalización de citas  
✔️ Histórico detallado para médicos y pacientes  
✔️ Autenticación y autorización con JWT  
✔️ SPA moderna con React + Fetch API  
✔️ Backend escalable con Spring Boot y JPA  
✔️ Soporte para fotos de perfil  

## 🏗️ Tecnologías Utilizadas
### 🗄️ Backend

- Spring Boot 3
- Java 17
- Spring Security + JWT
- Spring Data JPA
- MySQL 8
- Maven
- Arquitectura en capas (presentation, logic, data)

### 🧩 Frontend

- React (SPA)
- React Router
- CSS Modules
- Fetch API
- Vite (opcional), o React Scripts

### 🛠️ Tooling

- Node.js
- Git & GitHub
- FileTree Pro
- Maven Wrapper

## 🧱 Arquitectura del Proyecto

El proyecto está dividido en dos módulos principales:

### 🔧 Backend (Spring Boot)
```bash
src/main/java/com/example/citasmedicasbe
│── data/            → Repositorios (Admin, Médico, Paciente, Citas, Horarios)
│── logic/           → Entidades y servicios
│── presentation/    → Controladores REST
│── security/        → Seguridad JWT
│── CitasmedicasbeApplication.java
src/main/resources
│── application.properties
```
Listado de componentes clave:
- Controllers: UsuarioController, MedicoController, CitaController, HorariosMedicoController
- Services: UsuarioService, MedicoService, CitaService, HorariosMedicoService
- Repositories: UsuarioRepository, MedicoRepository, PacienteRepository, CitaRepository
- Security: SecurityConfig, TokenService, JwtConfig

### 🖥️ Frontend (React SPA)
```bash
src/
│── components/    → Header, Footer, RequestImage
│── pages/         → Todas las pantallas (Login, Registro, Perfil, Citas…)
│── utils/         → FetchRequest.js
│── App.jsx
│── index.js
public/
│── images/         → Iconos, fotos, logos
│── index.html
```
Pantallas principales:
- Login / Registro
- Buscar Cita
- Confirmar Cita
- Horario Extendido
- Perfil del Médico
- Gestión de Citas del Médico
- Histórico del Paciente

Aprobación de Médicos (Admin)
## 🧰 Requisitos Previos

Asegúrate de tener instalado:
### Backend
- Java 17
- Maven
- MySQL 8
- 
### Frontend
- Node.js >= 18
- NPM o Yarn

## 🚀 Instalación
1. Clonar el repositorio

```bash
git clone https://github.com/sebastian-alpizar/medical-appointment-system.git
cd medical-appointment-system
```

### ⚙️ Configuración del Backend (Spring Boot)

2. Configurar el archivo `application.properties`:
- Credenciales MySQL
- Ruta de almacenamiento de fotos (`picturesPath`)
- Clave secreta JWT

Ejemplo:
```bash
spring.datasource.url=jdbc:mysql://localhost:3306/DBCitasMedicas
spring.datasource.username=root
spring.datasource.password=

security.jwt.secret-key=TU_CLAVE_AQUI
picturesPath=C:/AAA/images/
```

3. Construir el proyecto Backend
```bash
cd citasmedicasbe
mvn clean install
```

4. Iniciar el servidor Backend
```bash
mvn spring-boot:run
```
Backend por defecto:
👉 http://localhost:8080

### 🖥️ Configuración del Frontend (React)
5. Construir el proyecto
```bash
cd citasmedicasfe
npm install
```

6. Ejecutar Frontend:
```bash
npm start
```
El frontend se ejecutará típicamente en:
👉 http://localhost:3000

## 📡 Comunicación del Sistema

🔄 Flujo General

- El paciente busca médicos por especialidad y ciudad
- Elige un horario disponible
- Si no ha iniciado sesión, se solicita login/registro
- El paciente confirma la cita
- El médico puede visualizar, confirmar o completar citas
- El administrador aprueba médicos nuevos
- Pacientes y médicos pueden consultar su historial

## 📊 Ejemplos Visuales
![System](docs/images/system.png)

## 📦 Despliegue

Opciones recomendadas:

**Backend (Spring Boot)** 

- Configurar application.properties
- Crear base de datos en MySQL
- Desplegar en:
  AWS EC2
  Azure
  Google Cloud
  Railway
  VPS con Nginx

**Frontend (React)**
```bash
npm run build
```
Publicar `/build` o `/dist` en:
- Netlify
- Vercel
- Render
- GitHub Pages

## 👤 Autor

**Desarrollado por Sebastián Alpízar Porras**  
GitHub: https://github.com/sebastian-alpizar  
Email: sebastianalpiz@gmail.com
