from ultralytics import YOLOE

# YOLOE 모델 로드 (최초 실행 시 자동 다운로드)
model = YOLOE("yoloe-11s-seg.pt")

# 찾고 싶은 것을 텍스트로 지정
prompts = ["button", "login button", "yellow button", "text label"]
model.set_classes(prompts, model.get_text_pe(prompts))

# 게임 화면에서 추론
results = model.predict(
    "../dataset/yolo-dataset/images/",
    conf=0.1,
    save=True
)

# 결과 출력
for r in results:
    name = r.path.split("\\")[-1]
    if len(r.boxes) > 0:
        print(f"\n{name}: {len(r.boxes)}개 탐지")
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            print(f"  '{prompts[cls_id]}' conf={conf:.3f}")
    else:
        print(f"{name}: 탐지 없음")