from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key="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")

@app.get("/")
def root():
    return {"message": "DermScan backend running"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    image_data = await file.read()
    b64 = base64.b64encode(image_data).decode("utf-8")
    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": file.content_type,
                            "data": b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": "You are an advanced AI skin health assistant inside DermScan. Analyze this image thoroughly for any of the following: acne of all types, eczema, psoriasis, rosacea, hives, dry skin, cuts, lacerations, bruises, burns, abrasions, infected wounds, fungal infections like ringworm, bacterial infections like cellulitis, viral infections like warts or cold sores, shingles, suspicious moles that may indicate melanoma, skin cancer warning signs including asymmetry irregular borders unusual color or large diameter, basal cell carcinoma signs, squamous cell carcinoma signs, abnormal growths or lesions, allergic reactions, insect bites, sunburn, hyperpigmentation, vitiligo, or any other dermatological concern. For each finding describe what you observe, rate severity as low moderate or high, explain what it could indicate, and give clear next steps including whether they should see a GP a dermatologist or go to urgent care. If you see any warning signs of skin cancer or serious infection tell them clearly and urgently to see a doctor. Never recommend specific medications. Be thorough, clear, and compassionate. Format your response with sections: What I See, Severity, What This Could Mean, Next Steps, Mental Health Note.",
                    },
                ],
            }
        ],
    )
    return {"result": message.content[0].text}

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=512,
        system="You are DermBot, a skin health assistant. Only answer questions about skin conditions, wounds, rashes, blemishes, and when to see a doctor. Never recommend specific medications. Keep answers short and clear.",
        messages=[{"role": "user", "content": req.message}],
    )
    return {"reply": message.content[0].text}
