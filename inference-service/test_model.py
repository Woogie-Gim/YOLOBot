from ultralytics import YOLO

model = YOLO("model/guest_login_v1.pt")

# 임계값을 극단적으로 낮춰서 확인
results = model("../dataset/yolo-dataset/images/", conf=0.01, save=True)

for r in results:
    if len(r.boxes) > 0:
        for box in r.boxes:
            print(f"{r.path.split('\\')[-1]}: conf={float(box.conf[0]):.4f}")