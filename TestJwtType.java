import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class TestJwtType {
    public static void main(String[] args) throws Exception {
        String secret = "farmxp_super_secret_key_for_jwt_generation_that_is_long_enough";
        String header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payload = "{\"sub\":\"2\",\"username\":\"testadmin\",\"role\":\"ADMIN\",\"iat\":1718000000,\"exp\":1800000000}";
        
        String b64Header = Base64.getUrlEncoder().withoutPadding().encodeToString(header.getBytes());
        String b64Payload = Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes());
        
        String data = b64Header + "." + b64Payload;
        
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(), "HmacSHA256"));
        byte[] hash = mac.doFinal(data.getBytes());
        
        String signature = Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        
        String token = data + "." + signature;
        System.out.println(token);
    }
}
