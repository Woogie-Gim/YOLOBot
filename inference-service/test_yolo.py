from ultralytics import YOLO

# 사전학습된 기본 모델 로드 (최초 실행 시 자동 다운로드)
model = YOLO("yolo11n.pt")

# 캡처한 화면으로 추론
results = model("../capture-test.png")

# 탐지 결과 출력
for r in results:
    print(f"탐지된 객체 수: {len(r.boxes)}")
    for box in r.boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        print(f"  {model.names[cls_id]}: {conf:.2f}")