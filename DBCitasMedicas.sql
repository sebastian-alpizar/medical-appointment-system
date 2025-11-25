CREATE DATABASE DBCitasMedicas;

USE DBCitasMedicas;

CREATE TABLE usuarios (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(500) NULL,
    clave VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'MEDICO', 'PACIENTE') NOT NULL
);

CREATE TABLE pacientes (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    id_usuario VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE admins (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    id_usuario VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE medicos (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_usuario VARCHAR(50) NOT NULL,
    costo_consulta DECIMAL(10,2) NULL,
	frecuencia_cita INT,
    especialidad VARCHAR(100) NULL,
    ubicacion varchar(50) NULL,
    hospital varchar(50) NULL,
    aceptado boolean DEFAULT false,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE horarios_medico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_medico VARCHAR(50),
    dia ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
    fecha DATE NOT NULL, -- Fecha específica (ejemplo: 01/03/2025)
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    frecuencia INT NOT NULL, -- En minutos (ejemplo: 60, 30, 20)
    FOREIGN KEY (id_medico) REFERENCES medicos(id) ON DELETE CASCADE
);

CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente VARCHAR(50) NOT NULL,
    id_medico VARCHAR(50) NOT NULL,
	nota varchar(200) NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado boolean DEFAULT false,
    FOREIGN KEY (id_paciente) REFERENCES pacientes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_medico) REFERENCES medicos(id) ON DELETE CASCADE
);