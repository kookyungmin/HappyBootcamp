package net.happykoo.jasypt;

import lombok.extern.slf4j.Slf4j;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.TestPropertySource;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

@TestPropertySource( properties = { "jasypt.encryptor.password=Bean1234@@" })
@Slf4j
public class JasyptTest {

    @Value("${jasypt.encryptor.password}")
    private String encryptKey;

    @Test
    public void jasyptTest() {
        Map<String, String> dbInfo = new HashMap<>();
        dbInfo.put("driverNm", "");
        dbInfo.put("jdbcUrl", "");
        dbInfo.put("userNm", "");
        dbInfo.put("userPw", "");
        dbInfo.put("cryptoKey", "flskdlqjstm");

        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();

        config.setPassword(encryptKey);
        config.setAlgorithm("PBEWithMD5AndDES");
        config.setKeyObtentionIterations("1000");
        config.setPoolSize("1");
        config.setProviderName("SunJCE");
        config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");
        config.setIvGeneratorClassName("org.jasypt.iv.RandomIvGenerator");
        config.setStringOutputType("base64");
        encryptor.setConfig(config);

        dbInfo.forEach((key, value) -> {
            String encryptText = encryptor.encrypt(value);
            String decryptText = encryptor.decrypt(encryptText);

            log.info("key: " + key);
            log.info("encryptText: " + encryptText);
            log.info("decryptText: " + decryptText);
            assertEquals(value, decryptText);
        });
    }
}