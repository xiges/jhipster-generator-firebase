package <%= packageName %>.domain;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public class FirebaseAuthenticationToken extends UsernamePasswordAuthenticationToken {
        private static final long serialVersionUId = 1L;
        private final String token;


    public FirebaseAuthenticationToken(final String token) {
        super(null, null);
        this.token = token;
    }

    public String getToken(){
        return token;
    }
}
