from fastapi import FastAPI, Request
import uvicorn
import base64

app = FastAPI()

# 화면 인식 요청을 받아 탐지 결과를 반환 (현재는 가짜 고정 응답)
@app.post("/infer")
async def infer(request: Request):
    body = await request.json()
    image_b64 = body.get("image", "")

    # base64로 온 이미지를 복원해 크기 확인 (통신 검증용)
    image_bytes = base64.b64decode(image_b64) if image_b64 else b""
    print(f"[추론 요청] 이미지 수신: {len(image_bytes)} bytes")

    # 실제로는 여기서 YOLO 추론을 하지만, 지금은 가짜 결과 반환
    return {
        "elements": [
            {
                "label": "guest_login",
                "bbox": [900, 850, 200, 80],
                "confidence": 0.95,
                "method": "yolo"
            }
        ]
    }

# 서버 상태 확인용 (Node가 서버가 살아있는지 체크할 때 사용)
@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    # 127.0.0.1(내 컴퓨터 전용)에만 열고 8756 포트 사용
    uvicorn.run(app, host="127.0.0.1", port=8756)