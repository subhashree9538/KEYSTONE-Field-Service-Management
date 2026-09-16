package com.example.demo.service;
import com.example.demo.repository.UserRepository;
import com.example.demo.entity.User;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
	    this.userRepository = userRepository;
	    this.passwordEncoder = passwordEncoder;
	}
	public User saveUser(User user) {

	    System.out.println("PASSWORD RECEIVED: " + user.getPassword());

	    user.setPassword(passwordEncoder.encode(user.getPassword()));

	    System.out.println("PASSWORD ENCODED: " + user.getPassword());

	    return userRepository.save(user);
	}
	public java.util.Optional<User> findByUsername(String username) {
	    return userRepository.findByUsername(username);
	}
	public List<User> getAllUsers() {
	    return userRepository.findAll();
	}
}