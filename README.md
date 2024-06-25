# StructMind - ChatGPT 提示词模版管理工具

## 概述

StructMind 是一个 Chrome 浏览器扩展，专为管理和生成 ChatGPT 提示词模板而设计。通过支持预定义和自定义模板的分类管理，以及占位符替换功能，它使得模板的使用变得简单而高效。StructMind 集成在 Chrome 的侧边栏中，用户可以方便快捷地访问和操作。
## 功能特性

- **模版管理**：支持对预定义模版和自定义模版进行分类管理，方便用户根据需求进行选择和编辑。
- **占位符替换**：通过占位符自动替换功能，用户可以根据需要生成定制化的提示词。
- **侧边栏集成**：插件以 Chrome 侧边栏形式呈现，用户可以快速访问和操作。
- **多语言支持**：支持中英文切换，满足不同语言环境下的需求。
- **自定义模版编辑器**：用户可以编辑和使用自定义模版，适应特定的使用场景。

## 安装步骤

1. **下载或克隆仓库**：获取最新的源代码。
2. **加载扩展程序**：
   - 打开 Chrome 浏览器并导航至 `chrome://extensions/`。
   - 开启右上角的 "开发者模式"。
   - 点击 "加载已解压的扩展程序" 并选择包含扩展程序文件的目录。

## 文件说明

### manifest.json

这是扩展程序的配置文件，定义了插件的名称、版本、权限及核心设置。它包含了插件的元数据以及需要加载的背景脚本和默认的侧边栏页面。

### background.js

后台脚本，用于处理扩展程序的初始化和点击事件。当用户点击扩展程序图标时，打开侧边栏并加载 `panel.html`。

### panel.html

侧边栏的主页面，定义了用户界面结构，包括菜单和内容区域。它通过包含的 CSS 文件 `style.css` 来美化界面，并引入 `script.js` 来处理页面的动态行为。

### script.js

前端逻辑脚本，用于处理侧边栏中的菜单加载和用户交互。它从 `menu.json` 中获取数据，动态构建菜单，并处理模版的选择和内容显示。

### style.css

样式表文件，为侧边栏页面和动态内容提供样式支持。它定义了页面布局、字体、颜色和交互效果，使得用户界面美观且易于使用。

### panel.js

该文件用来监听消息并处理侧边栏的打开操作。它确保当用户触发特定操作时，侧边栏会响应并展示相应的内容。

### template.html

自定义模版编辑器的主页面，用于编辑和显示自定义模版。它包含了用户界面元素和必要的脚本引用。

### template.js

自定义模版的前端逻辑脚本，负责处理模版编辑器中的用户输入和占位符替换逻辑。它支持用户动态编辑和实时预览模版生成的提示词。

## menu.json

`menu.json` 文件用于定义 StructMind 插件中侧边栏的菜单结构和内容。该文件支持多层嵌套的菜单项，每个菜单项可以包含子菜单或文件。菜单结构可以具有任意的层级深度，以便灵活地组织内容。

### create_json.py

`create_json.py` 脚本用于从现有的目录结构生成menu.json文件。

### create_folder.py

`create_folder.py` 脚本用于从menu.json生成对应目录结构。

### 结构说明

- **根目录 (object)**: 根目录下的键代表主菜单项或子菜单项的名称，值可以是子目录或文件的定义。

  - **子目录 (object)**: 子目录下的键代表子菜单项的名称，值可以是更深层次的子目录或文件的定义。
  - **文件 (object)**: 文件具有以下属性，用于定义其行为和内容：
    - **icon** (string, optional): 文件的图标路径或图标名称，仅支持google icons。
    - **UsageDescription** (string): 文件的使用描述。
    - **ChinesePromptTemplate** (string): 文件的中文提示词模版，使用 `{{...}}` 表示占位符。
    - **EnglishPromptTemplate** (string): 文件的英文提示词模版，使用 `{{...}}` 表示占位符。
    - **Inputs** (array): 定义占位符输入的列表，每个元素包含以下字段：
      - **InputPlaceholder** (string): 输入框占位符的名称或描述。
      - **InputLabel** (string): 输入框标签，用于说明输入内容。
      - **InputList** (array): 可选项的下拉菜单列表，元素为字符串。

#### 示例

以下是一个 `menu.json` 文件的示例，展示了多层菜单的结构及文件的详细属性：

```json
{
  "Templates": {
    "预定义模版": {
      "常用问候语": {
        "早安问候": {
          "icon": "icon-morning",
          "UsageDescription": "用于早上的问候模版",
          "ChinesePromptTemplate": "早上好，{{...}}！",
          "EnglishPromptTemplate": "Good morning, {{...}}!",
          "Inputs": [
            {
              "InputPlaceholder": "name",
              "InputLabel": "名字",
              "InputList": null
            }
          ]
        },
        "晚安问候": {
          "icon": "icon-night",
          "UsageDescription": "用于晚上的问候模版",
          "ChinesePromptTemplate": "晚安，{{...}}！",
          "EnglishPromptTemplate": "Good night, {{...}}!",
          "Inputs": [
            {
              "InputPlaceholder": "name",
              "InputLabel": "名字",
              "InputList": null
            }
          ]
        }
      },
      "感谢词": {
        "icon": "icon-thanks",
        "UsageDescription": "表达感谢的模版",
        "ChinesePromptTemplate": "谢谢你，{{...}}！",
        "EnglishPromptTemplate": "Thank you, {{...}}!",
        "Inputs": [
          {
            "InputPlaceholder": "type",
            "InputLabel": "同事类型",
            "InputList": ["朋友", "客户", "合作伙伴"]
          }
        ]
      }
    },
    "自定义模式":{
        "自定义模版":{
                "UsageDescription": "xxx",
                "ChinesePromptTemplate": "xxx",
                "EnglishPromptTemplate": "xxx",
                "Inputs": [],
                "icon": "dashboard_customize"
        }
    }
  }
}
```

### 使用说明
若需修改现有功能，请按以下步骤操作：

   - 调整 Templates 文件夹中的 JSON 文件：确保 JSON 格式符合“结构说明”的要求。
   - 执行 create_menu.py 脚本：运行 create_menu.py 文件以生成 menu.json。