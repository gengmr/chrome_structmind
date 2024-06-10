import json
import os
from typing import Any, Dict


def create_directory_structure(base_path: str, structure: Dict[str, Any]):
    """
    根据给定的目录结构字典创建目录和模板文件。
    :param base_path: 基础目录路径
    :param structure: 目录结构字典
    """
    for name, content in structure.items():
        current_path = os.path.join(base_path, name)

        if isinstance(content, dict) and "UsageDescription" in content:
            # 创建模板文件
            with open(current_path + '.json', 'w', encoding='utf-8') as f:
                json.dump(content, f, ensure_ascii=False, indent=4)
            print(f"创建模板文件: {current_path}.json")
        elif isinstance(content, dict):
            # 创建目录
            os.makedirs(current_path, exist_ok=True)
            print(f"创建目录: {current_path}")
            # 递归创建子目录和文件
            create_directory_structure(current_path, content)
        else:
            print(f"跳过未识别的项: {name}，内容类型: {type(content)}")


def main(json_file_path: str, root_directory: str):
    """
    从指定的JSON文件路径读取数据并创建目录结构。
    :param json_file_path: JSON文件的路径
    :param root_directory: 要创建目录结构的根目录路径
    """
    # 读取JSON文件内容
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # 创建根目录（如果不存在）
    os.makedirs(root_directory, exist_ok=True)

    # 创建目录结构
    create_directory_structure(root_directory, data)


if __name__ == '__main__':
    # 指定JSON文件路径
    json_file_path = 'menu.json'
    # 指定要创建目录结构的根目录
    root_directory = './Templates'
    # 调用主函数
    main(json_file_path, root_directory)
