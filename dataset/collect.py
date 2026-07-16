import subprocess
import time
import os
from datetime import datetime

OUTPUT_DIR = "images"
INTERVAL = 1.0  # 캡처 간격(초)
COUNT = 20      # 캡처할 장수

# adb exec-out으로 화면을 캡처해 파일로 저장
def capture(path):
    result = subprocess.run(
        ["adb", "exec-out", "screencap", "-p"],
        capture_output=True
    )
    if result.returncode != 0:
        print(f"캡처 실패: {result.stderr.decode()}")
        return False
    with open(path, "wb") as f:
        f.write(result.stdout)
    return True

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for i in range(COUNT):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
        path = os.path.join(OUTPUT_DIR, f"screen_{timestamp}.png")

        if capture(path):
            print(f"[{i+1}/{COUNT}] 저장: {path}")

        time.sleep(INTERVAL)

    print(f"\n총 {COUNT}장 수집 완료 → {OUTPUT_DIR}/")