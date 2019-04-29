package <%= packageName %>.config;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.api.client.util.Strings;
import <%= packageName %>.domain.FirebaseAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import java.io.IOException;

public class FirebaseAuthenticationTokenFilter extends AbstractAuthenticationProcessingFilter {

    private final static String TOKEN_HEADER = "X-Firebase-Auth";


    public FirebaseAuthenticationTokenFilter(){
        super("/auth/**");

    }


    @Override
    public Authentication attemptAuthentication(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws AuthenticationException, IOException, ServletException {
        final String authtoken = httpServletRequest.getHeader(TOKEN_HEADER);
        if (Strings.isNullOrEmpty(authtoken)){
            throw new RuntimeException("Invalid auth token");
        }

        return getAuthenticationManager().authenticate(new FirebaseAuthenticationToken(authtoken));
    }

    /**
     * Make sure the rest of the filterchain is satisfied
     *
     * @param request
     * @param response
     * @param chain
     * @param authResult
     * @throws IOException
     * @throws ServletException
     */


    protected void successfullAuthentication(HttpServletRequest request, HttpServletResponse response , FilterChain chain,Authentication authResult)
    throws  IOException,ServletException{
        super.successfulAuthentication(request,response,chain,authResult);

        //As this authentication is in HTTP header, after succsess we need to continue the request normally
        //and return the response as if resource was not secured at all

        chain.doFilter(request,response);


    }
}
