package net.happykoo.jasypt;

//@TestPropertySource( properties = { "jasypt.encryptor.password=Bean@@" })
//@Slf4j
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