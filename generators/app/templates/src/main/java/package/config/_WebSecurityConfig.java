package <%= packageName %>.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private FirebaseAuthenticationProvider authenticationProvider;

    @Bean
    @Override
    public AuthenticationManager authenticationManager() throws Exception{
        return new ProviderManager(Arrays.asList(authenticationProvider));
    }

    public FirebaseAuthenticationTokenFilter authenticationTokenFilterBean() throws Exception{
        FirebaseAuthenticationTokenFilter authenticationTokenFilter = new FirebaseAuthenticationTokenFilter();
        authenticationTokenFilter.setAuthenticationManager(authenticationManager());
        authenticationTokenFilter.setAuthenticationSuccessHandler((httpServletRequest, httpServletResponse, authentication) -> {});
        return authenticationTokenFilter;


    }

    @Override
    protected void configure(HttpSecurity  httpSecurity)throws Exception{
        httpSecurity

                    .cors()
                    .and()
                //we don't need CSRF because our token invulnerable
                    .csrf().disable()
                //all URLS must be authenticated (filter for token always fires(/**))
                    .authorizeRequests()
                        .antMatchers(HttpMethod.OPTIONS).permitAll()
                        .antMatchers("/auth/**").authenticated()
                .and()
                // We are not creating a session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        // adding Custom JWT based security filter
        httpSecurity.addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class);

        //disable page caching

    }
}
