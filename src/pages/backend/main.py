from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_connection

app = FastAPI()

# -----------------------------------------------------------
# CORS CONFIGURATION
# -----------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # replace with your frontend origin later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------
# MODELS
# -----------------------------------------------------------

class RegisterUser(BaseModel):
    name: str
    email: str
    password: str


class LoginUser(BaseModel):
    email: str
    password: str


class ProductModel(BaseModel):
    user_id: int
    product_name: str
    category: str
    model_number: str
    serial_number: str
    purchase_date: str
    warranty_period: str
    email: str


# -----------------------------------------------------------
# REGISTER USER
# -----------------------------------------------------------

@app.post("/register")
def register_user(data: RegisterUser):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Insert user
        query = """
            INSERT INTO users (name, email, password)
            VALUES (%s, %s, %s)
        """
        values = (data.name, data.email, data.password)

        cursor.execute(query, values)
        conn.commit()

        return {"message": "User registered successfully!"}

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()


# -----------------------------------------------------------
# LOGIN USER
# -----------------------------------------------------------

@app.post("/login")
def login_user(data: LoginUser):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT * FROM users
            WHERE email = %s AND password = %s
        """
        values = (data.email, data.password)

        cursor.execute(query, values)
        user = cursor.fetchone()

        if not user:
            return {"error": "Invalid email or password"}

        # Format user data for frontend
        user_data = {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user.get("phone", ""),
            "address": user.get("address", ""),
            "joinDate": str(user.get("created_at", "")),
        }

        return {
            "message": "Login successful",
            "token": "dummy-token",    # optional JWT later
            "user": user_data
        }

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()


# -----------------------------------------------------------
# REGISTER PRODUCT (WARRANTY)
# -----------------------------------------------------------

@app.post("/add-product")
def add_product(data: ProductModel):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO products 
            (user_id, product_name, category, model_number, serial_number, 
             purchase_date, warranty_period, email)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            data.user_id,
            data.product_name,
            data.category,
            data.model_number,
            data.serial_number,
            data.purchase_date,
            data.warranty_period,
            data.email,
        )

        cursor.execute(query, values)
        conn.commit()

        return {"message": "Product registered successfully!"}

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()
