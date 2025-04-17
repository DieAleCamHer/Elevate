-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 10-04-2025 a las 19:27:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `elevate_gestor`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividad`
--

CREATE TABLE `actividad` (
  `id` int(11) NOT NULL,
  `accion` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `proyecto_id` int(11) DEFAULT NULL,
  `tarea_id` int(11) DEFAULT NULL,
  `especifica_id` int(11) DEFAULT NULL,
  `historial_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `actividad`
--

INSERT INTO `actividad` (`id`, `accion`, `descripcion`, `usuario_id`, `fecha`, `proyecto_id`, `tarea_id`, `especifica_id`, `historial_id`) VALUES
(1, 'CREAR_USUARIO', 'Se creó el usuario: Diego Campos', 1, '2025-04-01 14:00:00', NULL, NULL, NULL, NULL),
(2, 'CREAR_USUARIO', 'Se creó el usuario: Christopher Aquino', 2, '2025-04-01 15:00:00', NULL, NULL, NULL, NULL),
(3, 'CREAR_USUARIO', 'Se creó el usuario: Kevin Armando', 3, '2025-04-01 16:00:00', NULL, NULL, NULL, NULL),
(4, 'CREAR_USUARIO', 'Se creó el usuario: Xavier Fuentes', 4, '2025-04-01 17:00:00', NULL, NULL, NULL, NULL),
(5, 'CREAR_USUARIO', 'Se creó el usuario: Vladimir Bonilla', 5, '2025-04-01 18:00:00', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial`
--

CREATE TABLE `historial` (
  `id` int(11) NOT NULL,
  `especifica_id` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `porcentaje` int(11) DEFAULT 0,
  `asignado_a` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial`
--

INSERT INTO `historial` (`id`, `especifica_id`, `comentario`, `porcentaje`, `asignado_a`) VALUES
(1, 1, 'Comentario sobre tarea 1', 10, 3),
(2, 2, 'Comentario sobre tarea 2', 20, 3),
(3, 3, 'Comentario sobre tarea 3', 30, 3),
(4, 4, 'Comentario sobre tarea 4', 40, 4),
(5, 5, 'Comentario sobre tarea 5', 50, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `gerente_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyectos`
--

INSERT INTO `proyectos` (`id`, `nombre`, `descripcion`, `fecha_inicio`, `fecha_fin`, `gerente_id`) VALUES
(1, 'Proyecto A', 'Descripción del proyecto A', '2025-01-01', '2025-12-31', 2),
(2, 'Proyecto B', 'Descripción del proyecto B', '2025-02-01', '2025-11-30', 2),
(3, 'Proyecto C', 'Descripción del proyecto C', '2025-03-01', '2025-10-31', 5),
(4, 'Proyecto D', 'Descripción del proyecto D', '2025-04-01', '2025-09-30', 5),
(5, 'Proyecto E', 'Descripción del proyecto E', '2025-05-01', '2025-08-31', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`) VALUES
(1, 'Administrador del Sistema'),
(2, 'Gerente del Proyecto'),
(3, 'Miembro del Proyecto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

CREATE TABLE `tareas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('Pendiente','En Progreso','Completada') DEFAULT 'Pendiente',
  `porcentaje_avance` int(3) DEFAULT 0,
  `proyecto_id` int(11) DEFAULT NULL,
  `asignado_a` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`id`, `nombre`, `descripcion`, `estado`, `porcentaje_avance`, `proyecto_id`, `asignado_a`) VALUES
(1, 'Tarea 1', 'Descripción de la tarea 1', 'Pendiente', 0, 1, 3),
(2, 'Tarea 2', 'Descripción de la tarea 2', 'En Progreso', 50, 2, 4),
(3, 'Tarea 3', 'Descripción de la tarea 3', 'Completada', 100, 3, 3),
(4, 'Tarea 4', 'Descripción de la tarea 4', 'Pendiente', 0, 4, 4),
(5, 'Tarea 5', 'Descripción de la tarea 5', 'En Progreso', 75, 5, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas_especificas`
--

CREATE TABLE `tareas_especificas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('Pendiente','En Progreso','Completada') DEFAULT 'Pendiente',
  `tarea_padre_id` int(11) NOT NULL,
  `asignado_a` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tareas_especificas`
--

INSERT INTO `tareas_especificas` (`id`, `nombre`, `descripcion`, `estado`, `tarea_padre_id`, `asignado_a`) VALUES
(1, 'Subtarea 1 de Tarea 1', 'Descripción de la subtarea 1', 'Pendiente', 1, 3),
(2, 'Subtarea 2 de Tarea 1', 'Descripción de la subtarea 2', 'Completada', 1, 4),
(3, 'Subtarea 1 de Tarea 2', 'Descripción de la subtarea 1', 'En Progreso', 2, 3),
(4, 'Subtarea 1 de Tarea 3', 'Descripción de la subtarea 1', 'Pendiente', 3, 4),
(5, 'Subtarea 1 de Tarea 4', 'Descripción de la subtarea 1', 'Completada', 4, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `contrasena` varchar(100) NOT NULL,
  `rol_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `contrasena`, `rol_id`) VALUES
(1, 'Diego Campos', '123', 1),
(2, 'Christopher Aquino', '456', 2),
(3, 'Kevin Armando', '789', 3),
(4, 'Xavier Fuentes', '101', 3),
(5, 'Vladimir Bonilla', '112', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_actividad_usuarios` (`usuario_id`),
  ADD KEY `fk_actividad_proyecto` (`proyecto_id`),
  ADD KEY `fk_actividad_tarea` (`tarea_id`),
  ADD KEY `fk_actividad_especifica` (`especifica_id`),
  ADD KEY `fk_actividad_historial` (`historial_id`);

--
-- Indices de la tabla `historial`
--
ALTER TABLE `historial`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_historial_especifica` (`especifica_id`),
  ADD KEY `fk_historial_asignado` (`asignado_a`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_proyectos_usuarios` (`gerente_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tareas_proyectos` (`proyecto_id`),
  ADD KEY `fk_tareas_usuarios` (`asignado_a`);

--
-- Indices de la tabla `tareas_especificas`
--
ALTER TABLE `tareas_especificas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tareas_especificas_tareas` (`tarea_padre_id`),
  ADD KEY `fk_tareas_especificas_usuarios` (`asignado_a`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuarios_roles` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividad`
--
ALTER TABLE `actividad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `historial`
--
ALTER TABLE `historial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tareas`
--
ALTER TABLE `tareas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tareas_especificas`
--
ALTER TABLE `tareas_especificas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD CONSTRAINT `fk_actividad_especifica` FOREIGN KEY (`especifica_id`) REFERENCES `tareas_especificas` (`id`),
  ADD CONSTRAINT `fk_actividad_historial` FOREIGN KEY (`historial_id`) REFERENCES `historial` (`id`),
  ADD CONSTRAINT `fk_actividad_proyecto` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `fk_actividad_tarea` FOREIGN KEY (`tarea_id`) REFERENCES `tareas` (`id`),
  ADD CONSTRAINT `fk_actividad_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `historial`
--
ALTER TABLE `historial`
  ADD CONSTRAINT `fk_comentarios_tareas_tareas` FOREIGN KEY (`especifica_id`) REFERENCES `tareas` (`id`),
  ADD CONSTRAINT `fk_historial_asignado` FOREIGN KEY (`asignado_a`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `fk_historial_especifica` FOREIGN KEY (`especifica_id`) REFERENCES `tareas_especificas` (`id`);

--
-- Filtros para la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD CONSTRAINT `fk_proyectos_usuarios` FOREIGN KEY (`gerente_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD CONSTRAINT `fk_tareas_proyectos` FOREIGN KEY (`proyecto_id`) REFERENCES `proyectos` (`id`),
  ADD CONSTRAINT `fk_tareas_usuarios` FOREIGN KEY (`asignado_a`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `tareas_especificas`
--
ALTER TABLE `tareas_especificas`
  ADD CONSTRAINT `fk_tareas_especificas_tareas` FOREIGN KEY (`tarea_padre_id`) REFERENCES `tareas` (`id`),
  ADD CONSTRAINT `fk_tareas_especificas_usuarios` FOREIGN KEY (`asignado_a`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
