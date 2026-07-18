from fastapi import FastAPI, Request
from ultralytics import YOLO
import uvicorn
import base64
import io
from PIL import Image

app = FastAPI()

# 학습된 모델 로드 (서버 시작 시 1회)
model = YOLO("model/guest_login_v1.pt")

# 화면 인식 요청을 받아 YOLO 탐지 결과를 반환
@app.post("/infer")
async def infer(request: Request):
    body = await request.json()
    image_b64 = body.get("image", "")

    if not image_b64:
        return {"elements": []}

    # base64를 이미지로 복원
    image_bytes = base64.b64decode(image_b64)
    image = Image.open(io.BytesIO(image_bytes))

    # YOLO 추론 실행
    results = model(image, verbose=False)

    elements = []
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])

            # 중심 좌표와 크기 추출 (원본 이미지 기준 픽셀)
            x, y, w, h = box.xywh[0].tolist()

            elements.append({
                "label": model.names[cls_id],
                "bbox": [int(x - w / 2), int(y - h / 2), int(w), int(h)],
                "confidence": round(conf, 3),
                "method": "yolo"
            })

    print(f"[추론 완료] 탐지: {len(elements)}개")
    return {"elements": elements}

# 서버 상태 확인용
@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8756)