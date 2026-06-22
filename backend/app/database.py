import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    try:
        import psycopg
        conn = psycopg.connect(
            host="localhost", port=5432,
            user="postgres", password="postgres", dbname="postgres",
            connect_timeout=2
        )
        conn.close()
        DATABASE_URL = "postgresql+psycopg://postgres:postgres@localhost:5432/inventory_db"
    except Exception:
        DATABASE_URL = "sqlite:///./inventory.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
