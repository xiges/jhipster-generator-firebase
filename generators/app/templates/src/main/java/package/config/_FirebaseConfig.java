package <%= packageName %>.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {


    private String databaseUrl = "https://my-project-1532339983952.firebaseio.com";


    private String configPath = "src/main/resources/my-project.json";
@Bean
    public FirebaseAuth firebaseAuth() throws IOException{

    FileInputStream serviceAccount = new FileInputStream(configPath);

   // InputStream inputStream = FirebaseConfig.class.getClassLoader().getResourceAsStream(configPath);

    FirebaseOptions options = new FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .setDatabaseUrl(databaseUrl).build();


    FirebaseApp.initializeApp(options);

    return FirebaseAuth.getInstance();
}




}
