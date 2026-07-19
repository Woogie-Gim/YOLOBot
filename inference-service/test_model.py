from ultralytics import YOLO

model = YOLO("runs/detect/guest_login_v2/weights/best.pt")

results = model("../dataset/yolo-dataset/images/", conf=0.25, save=True)

detected = 0
for r in results:
    for box in r.boxes:
        detected += 1
        print(f"{r.path.split(chr(92))[-1]}: conf={float(box.conf[0]):.3f}")

print(f"\n총 {detected}개 탐지 (20장 중)")