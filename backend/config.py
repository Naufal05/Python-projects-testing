from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Pydantic will look for these exact names (case-insensitive) in the .env file
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

# Instantiate the settings object to use across the app
Settings = Settings()