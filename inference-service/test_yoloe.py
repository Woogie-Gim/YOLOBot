from ultralytics import YOLOE

# YOLOE 모델 로드 (최초 실행 시 자동 다운로드)
model = YOLOE("yoloe-11s-seg.pt")

# 찾고 싶은 것을 텍스트로 지정
prompts = ["button", "text", "sign", "banner", "rectangle", "icon", "menu"]
model.set_classes(prompts, model.get_text_pe(prompts))

# 게임 화면에서 추론
results = model.predict(
    "../dataset/yolo-dataset/images/4e31d969-screen_20260716_144655_619.png",
    conf=0.01,
    save=True
)

# 결과 출력
for r in results:
    print(f"탐지 {len(r.boxes)}개")
    for box in r.boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        print(f"  '{prompts[cls_id]}' conf={conf:.4f}")