import os
import pyperclip


def get_files_content(directory: str, exclude_files: list) -> str:
    """
    获取目录下所有文件（除排除文件外）的文件名和内容，并以指定格式返回。

    :param directory: 要扫描的目录
    :param exclude_files: 要排除的文件列表
    :return: 格式化的文件名和内容字符串
    """
    # 结果列表，初始包含格式说明
    result = ["以下是所有文件的文件名和内容：\n\n格式：\nxxx(文件名称)\n```\n文件内容\n```"]

    # 遍历目录中的所有文件
    for filename in os.listdir(directory):
        # 跳过要排除的文件
        if filename in exclude_files:
            continue

        filepath = os.path.join(directory, filename)
        # 仅处理文件（忽略目录）
        if os.path.isfile(filepath):
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            result.append(f"{filename}\n```\n{content}\n```")

    return '\n\n'.join(result)


if __name__ == '__main__':
    # 获取当前文件的文件名
    current_file = os.path.basename(__file__)
    # 获取当前文件的所在目录
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # 要排除的文件列表，包括自身和 menu.json
    exclude_files = [current_file, 'menu.json']

    # 获取目录中所有文件的内容（排除指定文件）
    files_content = get_files_content(current_directory, exclude_files)

    # 将文件内容复制到剪贴板
    pyperclip.copy(files_content)

    # 输出提示信息
    print("文件内容已复制到剪贴板。")
