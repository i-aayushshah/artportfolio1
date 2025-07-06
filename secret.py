import secrets

# Generate a 512-bit (64 bytes) secret key
secret_key = secrets.token_hex(64)
print("JWT Secret Key:", secret_key)
