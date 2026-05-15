package com.negocio.webPOO.repository;

import com.negocio.webPOO.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}