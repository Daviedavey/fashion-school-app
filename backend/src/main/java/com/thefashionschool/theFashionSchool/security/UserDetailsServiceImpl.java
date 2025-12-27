package com.thefashionschool.theFashionSchool.security;

import com.thefashionschool.theFashionSchool.model.User;
import com.thefashionschool.theFashionSchool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        System.out.println("Loading user: " + usernameOrEmail);
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail.toLowerCase(), usernameOrEmail.toLowerCase())
                .orElseThrow(() -> {
                    System.out.println("User not found in database: " + usernameOrEmail);
                    return new UsernameNotFoundException("User not found");
                });

        System.out.println("Found user: " + user.getUsername());
        System.out.println("User role: " + user.getRole());
        System.out.println("Password: " + user.getPassword());

        return UserDetailsImpl.build(user);
    }
}