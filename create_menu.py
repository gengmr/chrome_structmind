import json
import os
from typing import Any, Dict


def directory_to_json_structure(base_path: str) -> Dict[str, Any]:
    """
    将给定的目录结构转换为JSON格式的字典。
    :param base_path: 基础目录路径
    :return: 包含目录和文件结构的字典
    """
    structure = {}
    for entry in os.listdir(base_path):
        full_path = os.path.join(base_path, entry)
        if os.path.isdir(full_path):
            # 如果是目录，递归获取其结构
            structure[entry] = directory_to_json_structure(full_path)
        elif entry.endswith('.json'):
            # 如果是json文件，读取其内容
            with open(full_path, 'r', encoding='utf-8') as f:
                structure[os.path.splitext(entry)[0]] = json.load(f)
    return structure

def save_json_structure(json_file_path: str, structure: Dict[str, Any]):
    """
    将目录结构字典保存为JSON文件。
    :param json_file_path: JSON文件的路径
    :param structure: 目录结构字典
    """
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(structure, f, ensure_ascii=False, indent=4)

def main(root_directory: str, json_file_path: str):
    """
    从给定的根目录生成目录结构并保存为JSON文件。
    :param root_directory: 要读取目录结构的根目录路径
    :param json_file_path: 要保存的JSON文件的路径
    """
    # 获取目录结构
    structure = directory_to_json_structure(root_directory)
    # 保存为JSON文件
    save_json_structure(json_file_path, structure)
    print(f"Directory structure saved to {json_file_path}")


if __name__ == '__main__':
    # 指定要读取目录结构的根目录
    root_directory = './Templates'
    # 指定要保存的JSON文件路径
    json_file_path = './menu.json'
    # 调用主函数
    main(root_directory, json_file_path)
