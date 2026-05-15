package com.negocio.webPOO.controller;

import com.negocio.webPOO.model.Usuario;
import com.negocio.webPOO.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @PostMapping
    public ResponseEntity<Usuario> guardar(@RequestBody Usuario usuario) {
        if (usuario.getNombre() == null || usuario.getNombre().isBlank() || usuario.getCorreo() == null || usuario.getCorreo().isBlank() || usuario.getPassword() == null || usuario.getPassword().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Usuario> existente = repository.findByCorreo(usuario.getCorreo());
        if (existente.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        Usuario guardado = repository.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario usuario) {
        if (usuario.getCorreo() == null || usuario.getCorreo().isBlank() || usuario.getPassword() == null || usuario.getPassword().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        return repository.findByCorreo(usuario.getCorreo())
                .filter(u -> u.getPassword().equals(usuario.getPassword()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario datos) {
        return repository.findById(id).map(existente -> {
            if (datos.getNombre() != null && !datos.getNombre().isBlank()) {
                existente.setNombre(datos.getNombre());
            }

            if (datos.getCorreo() != null && !datos.getCorreo().isBlank()) {
                Optional<Usuario> correoExistente = repository.findByCorreo(datos.getCorreo());
                if (correoExistente.isPresent() && !correoExistente.get().getId().equals(id)) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).build();
                }
                existente.setCorreo(datos.getCorreo());
            }

            if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
                existente.setPassword(datos.getPassword());
            }

            Usuario actualizado = repository.save(existente);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }
}