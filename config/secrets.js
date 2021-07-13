module.exports = {

    projectName: process.env.PROJECT_NAME,

    host: process.env.HOST,
    port: process.env.PORT,

    databaseHost: process.env.DB_HOST,
    databasePort: process.env.DB_PORT,
    databaseUser: process.env.DB_USER,
    databasePass: process.env.DB_PASS,
    databaseName: process.env.DB_NAME,
    databaseConnectionLimit: process.env.DB_CONN_LIMIT,

    mail: {
        transport: {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                type: process.env.EMAIL_TYPE,
                clientId: process.env.EMAIL_CLIENT_ID,
                clientSecret: process.env.EMAIL_CLIENT_SECRET
            }
        },
        auth: {
            user: process.env.EMAIL_USER,
            refreshToken: process.env.EMAIL_REFRESH_TOKEN,
            accessToken: process.env.EMAIL_ACCESS_TOKEN,
            expires: process.env.EMAIL_ACCESS_TOKEN_EXPIRES
        }
    },

    secret_key: process.env.SECRET_KEY,

    crypto: {
        algorithm: process.env.CRYPTO_ALGORITHM,
        password: process.env.CRYPTO_PASSWORD
    },

    frontend_URL: process.env.frontend_URL,
    student_frontend_URL: process.env.student_frontend_URL,

    sendgridApiKey: process.env.SENDGRID_API_KEY,

    nodeMailer: {
        type: "service_account",
        project_id: "entuition-294507",
        private_key_id: "91f6d4b785e64d04978c6fa3893a567f62253b76",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCk9EBYEkQBrAiI\nLE6Adm0tW/sTMoW03aWhtPDqiIbkJIm9p0zPP4pdMXKOpkTy20tgJ15/znXIrSQu\n6x0UMuz9LLrFTfmfrcLrh4pJ8XW9KBleKIPU5z8rQ4/EaVyMLE1a0uTkwva6LqDQ\nEfLnaUZPfc6WNHZPjdRxODSOapfGYexHSEdtnOx7O8CrO7PvFhlK7ZvAH7TpQ16s\nZGjh01roZaJvZ3NuH3asMbyc70Lo8k+YJQOBD8ymFYokPYFTSz1rV5O2Lh64UgkZ\nbJ6IMeR5mdvsHpB5lU9t8J508SHLKTHIS4rdPLirgq/dZ4iedy+9HE/3x8CvV4LA\nOza8C2vVAgMBAAECggEAGed2RVO/qfLjYh3HHtsPg8yKjiC505tCfAsHZxAVUuA+\ntfGpw8V1i/Nhy0S8K4FEVy9yN9LrN0j4F4V6SxDrm59PHgCun09b1BNfJFk5cAD1\n6Y37lKR+DI7EazKlQylf5SVHpyR2N5XD+6Od8uOwPs0sc0p+Jo8eL2uFVrTRlz3K\nQWq2JJLOXnHw+aNm5hSRArZZ9fwhz1cYKcZHMruKEbb4vCQ4N1JYVIjBefQmWB8Z\n+TsR2KWoiG9S5qhzq5APGeg5X6usyckA5PsWXr2oBOhpchBqAKyC7/qhgcrXlTPL\nPRjJQzDXlB/4WL8aXAu4W4514c5hgcbT7Vpjzzze3wKBgQDkzUWHhbrYCXusnctD\nuDQ8laTR0A1Nk5Z28WRZTLLk96df+1wRnroOGym/ehirlDSA8aDjKaflseqaBTi3\nBciaXx8/9b6ZbeQWihgTR24hBfcwjz+cxNhIW18NN6n4RR9nmsXO4gDYAxslQsvU\nO8b1HPseAGCHeo80XOE54qzDuwKBgQC4kAM/8TZRQVd9KP6VpWxxFV0rOGQYY56l\n6rj/C44C2ZaraS4ExY+g4mzmChf7Wv2GJHtJK8bPFbOZrhThOED7V+MgXDzIXm3l\nvehNzTpgnfbs/EFQnelzMkCbTpcHGMPpX2YCykqhJqS2L64OD6o8m8od3ZxMBx4j\nMaH8YKFtrwKBgHSbCOxggzDG5Hi8knMY1cZqnW0wkxcOOIi1zWaVaDa44FxSRkHU\nmw3FWilzmE8ZYQi2HECpYh/15JJKRvU/xVSnVc3K+DBJiQzTpCFvLfk2iRv+ZXUH\n/RIjPvYFgGI/GBo9DsK4+6UbMCJ1QFwRevxAoNpRZuCk3YbaLw7JLzMxAoGATQNz\nB7SMmN1uN4DqsuEjXhCvHwDZ679uDQfkCDD3IkNPdtld5YnWxCiXjmo51Z4DWn1Q\noJjOzczdc8xLVCuYGglzciZrCqU0sIBNNmHj8TsZNYyRaKVsK7CVevkRVlnELlar\nh5CIEbTBWHCO7bklrULI1SuLM8JolgD4+goMcmsCgYB1GvLTLhuSbkLCb6C9XBfk\nqoDspkfMi+LaZ60WQEIeDZM/X1b9KMdGJRqcHpzeI1qi7brmKrnOUMshj4aRp+lk\nHSEq64axkjDzZKV0oiKxa29zprzyqyIj8lHrBMpHgaDUGf06VMxyC+d3//PqOraW\nCr7PGhrhyA/TuPaiIgSIXg==\n-----END PRIVATE KEY-----\n",
        client_email: "entuition-emails@entuition-294507.iam.gserviceaccount.com",
        client_id: "105399231516556204911",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/entuition-emails%40entuition-294507.iam.gserviceaccount.com"
      }
};
