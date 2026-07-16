from ultralytics import YOLO

# 사전학습 모델에서 시작 (전이학습)
model = YOLO("yolo11n.pt")

# 우리 데이터셋으로 추가 학습
model.train(
    data="C:/Users/pc/yolobot/dataset/yolo-dataset/dataset.yaml",
    epochs=50,
    imgsz=640,
    batch=4,
    name="guest_login_v1"
)