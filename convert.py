import os
from PIL import Image
from natsort import natsorted

def resize_and_convert_to_webp(source_folder, target_folder, max_width, max_height, quality=80):
    # 指定したフォルダが存在するか確認し、存在しなければ作成する
    if not os.path.exists(target_folder):
        os.makedirs(target_folder)

    # ソースフォルダ内のファイル名を取得してソートする
    file_list = natsorted(os.listdir(source_folder))

    # ソースフォルダ内のファイルをすべてチェックする
    for index, filename in enumerate(file_list):

        file_path = os.path.join(source_folder, filename)

        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
            with Image.open(file_path) as img:
                # アスペクト比を保ちながらリサイズする
                img.thumbnail((max_width, max_height), Image.LANCZOS)
                
                parts = filename.rsplit('-', 1)  # 最初のハイフンで分割
                new_filename = f"{parts[0].rsplit('.', 1)[0]}-{index}min.webp"

                new_file_path = os.path.join(target_folder, new_filename)
                img.save(new_file_path, 'webp', quality=quality)
                print(f'{file_path} -> {new_file_path} に変換しました。')



# 使用例
source_folder = 'docs/img'  # 変換する画像が入っているフォルダ
target_folder = 'min'  # 変換後の画像を保存するフォルダ
max_width = 500  # リサイズ後の最大幅
max_height = 500  # リサイズ後の最大高さ
quality = 80  # 圧縮率を指定（0から100の範囲で指定）

resize_and_convert_to_webp(source_folder, target_folder, max_width, max_height, quality)
