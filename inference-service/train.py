from ultralytics import YOLO

# 사전학습 모델에서 시작 (전이학습)
model = YOLO("yolo11n.pt")

# 우리 데이터셋으로 추가 학습
model.train(
    data="C:/Users/pc/yolobot/dataset/yolo-dataset/dataset.yaml",
    epochs=300,
    imgsz=640,
    batch=4,
    name="guest_login_v2",

    # 데이터 증강 설정
    hsv_h=0.015,      # 색조 변화
    hsv_s=0.7,        # 채도 변화
    hsv_v=0.4,        # 밝기 변화
    degrees=5,        # 회전 (±5도)
    translate=0.1,    # 위치 이동
    scale=0.5,        # 크기 변화
    fliplr=0.0,       # 좌우 반전 끔 (버튼은 방향이 의미 있어서)
    mosaic=1.0,       # 여러 이미지 조합
)