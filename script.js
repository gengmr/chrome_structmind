document.addEventListener('DOMContentLoaded', () => {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const menuContainer = document.getElementById('menu');

            const showFileTree = () => {
                menuContainer.innerHTML = '';
                const menu = buildMenu(data);
                menuContainer.appendChild(menu);
            };

            const buildMenu = (menuItems, level = 1) => {
                const ul = document.createElement('ul');
                Object.entries(menuItems).forEach(([key, value]) => {
                    const li = document.createElement('li');
                    li.classList.add('menu-item');

                    const heading = document.createElement('h' + (level + 1));

                    if (typeof value === 'object' && !Array.isArray(value) && !value.UsageDescription) {
                        heading.textContent = key;
                        heading.classList.add('folder');
                        const submenu = buildMenu(value, level + 1);
                        submenu.classList.add('submenu');
                        submenu.style.display = 'none';
                        li.appendChild(heading);
                        li.appendChild(submenu);
                        heading.addEventListener('click', (event) => {
                            event.stopPropagation();
                            const isActive = submenu.style.display === 'block';
                            const activeSubmenus = heading.parentElement.parentElement.querySelectorAll('.submenu.active');
                            activeSubmenus.forEach(activeSubmenu => {
                                activeSubmenu.style.display = 'none';
                                activeSubmenu.classList.remove('active');
                            });
                            submenu.style.display = isActive ? 'none' : 'block';
                            if (!isActive) {
                                submenu.classList.add('active');
                            }
                        });
                    } else if (value.UsageDescription) {
                        const iconSpan = document.createElement('span');
                        iconSpan.classList.add('material-icons', 'file-icon');
                        iconSpan.textContent = value.icon;
                        heading.appendChild(iconSpan);
                        const fileNameSpan = document.createElement('span');
                        fileNameSpan.textContent = ` ${key}`;
                        heading.appendChild(fileNameSpan);
                        heading.classList.add('file');
                        heading.addEventListener('click', () => {
                            showFileContent(key, value);
                        });
                        li.appendChild(heading);
                    }
                    ul.appendChild(li);
                });
                return ul;
            };

            const showFileContent = (fileName, fileData) => {
                menuContainer.innerHTML = '';

                if (fileName === "自定义模版") {
                    // 处理自定义模版逻辑
                    const fileContent = document.createElement('div');
                    fileContent.innerHTML = `
                        <button id="back-button" class="material-icons">arrow_back</button>
                        <h1 id="page-title">${fileName}</h1>
                        <p id="usage-description">在此编辑您的自定义模版。示例:
                        <br><br>请担任{{领域}}专家，根据以下信息提供专业、全面、详细的回答。
                        <br><br>任务: {{任务}} 例如：对某个概念进行详细解释，或对一个话题进行全面总结，或提供深入的见解和分析。
                        <br><br>输出: {{输出}} 例如：输出应包括具体的建议、分析或描述。
                        <br><br>附加信息: {{附加信息}} 例如：提供背景信息、相关数据或参考文献等。
                        <br><br>风格: {{风格}} 例如：使用严谨、客观的语言，避免口语化表达。
                        <br><br>反思: {{反思}} 例如：校对文字错误，确认内容逻辑清晰，确保信息全面准确。
                        </p>
                        <form id="dynamic-form"></form>
                        <div id="output-container">
                            <textarea id="output" readonly></textarea>
                            <button id="copy-button" class="material-icons">content_copy</button>
                        </div>
                    `;
                    menuContainer.appendChild(fileContent);

                    document.getElementById('back-button').addEventListener('click', showFileTree);

                    const form = document.getElementById('dynamic-form');
                    const templateEditor = document.createElement('textarea');
                    templateEditor.id = 'template-editor';
                    templateEditor.placeholder = '请编辑您的模版';
                    templateEditor.classList.add('styled-textarea'); // 统一使用的样式类
                    templateEditor.style.width = '100%';
                    templateEditor.style.height = '150px';

                    templateEditor.addEventListener('input', (event) => {
                        const start = event.target.selectionStart;
                        const end = event.target.selectionEnd;
                        updateFormFromTemplate();
                        event.target.setSelectionRange(start, end);
                    });

                    form.appendChild(templateEditor);

                    function updateFormFromTemplate() {
                        const existingInputs = Array.from(form.querySelectorAll('.input-group'));
                        existingInputs.forEach(inputDiv => inputDiv.remove());

                        const templateText = templateEditor.value;
                        const placeholders = templateText.match(/{{\s*[^}]+\s*}}/g) || [];

                        placeholders.forEach((placeholder) => {
                            const placeholderName = placeholder.slice(2, -2).trim();
                            const inputDiv = document.createElement('div');
                            inputDiv.classList.add('input-group');

                            const label = document.createElement('label');
                            label.textContent = placeholderName;
                            inputDiv.appendChild(label);

                            const textarea = document.createElement('textarea');
                            textarea.placeholder = `请输入${placeholderName}`;
                            textarea.dataset.placeholder = placeholder;
                            textarea.classList.add('styled-textarea');
                            inputDiv.appendChild(textarea);

                            form.appendChild(inputDiv);
                        });

                        form.addEventListener('input', updateOutput);
                    }

                    function updateOutput() {
                        const templateText = templateEditor.value;
                        let result = templateText;

                        const textareas = form.querySelectorAll('textarea');
                        const placeholders = templateText.match(/{{\s*[^}]+\s*}}/g) || [];

                        if (placeholders.length !== textareas.length) {
                            console.error("占位符和输入元素数量不一致");
                            return;
                        }

                        placeholders.forEach((placeholder, index) => {
                            const textarea = textareas[index];
                            const value = textarea.value.trim();
                            const placeholderPattern = new RegExp(`{{\\s*${placeholder.slice(2, -2).trim()}\\s*}}`, 'g');
                            result = result.replace(placeholderPattern, value ? value : '');
                        });

                        document.getElementById('output').value = result;
                    }

                    updateFormFromTemplate();

                    document.getElementById('copy-button').addEventListener('click', () => {
                        const output = document.getElementById('output');
                        navigator.clipboard.writeText(output.value).then(() => {
                            document.getElementById('copy-button').textContent = 'check';
                            setTimeout(() => {
                                document.getElementById('copy-button').textContent = 'content_copy';
                            }, 2000);
                        }).catch(err => {
                            console.error('Failed to copy text: ', err);
                        });
                    });
                } else {
                    // 非自定义模版处理逻辑
                    const fileContent = document.createElement('div');
                    fileContent.innerHTML = `
                        <button id="back-button" class="material-icons">arrow_back</button>
                        <h1 id="page-title">${fileName}</h1>
                        <p id="usage-description">${fileData.UsageDescription}</p>
                        <div id="language-toggle">
                            <label class="switch">
                                <input type="checkbox" id="language-switch">
                                <span class="slider round"></span>
                            </label>
                            <span id="language-label">中文</span>
                        </div>
                        <form id="dynamic-form"></form>
                        <div id="output-container">
                            <textarea id="output" readonly></textarea>
                            <button id="copy-button" class="material-icons">content_copy</button>
                        </div>
                    `;
                    menuContainer.appendChild(fileContent);

                    document.getElementById('back-button').addEventListener('click', showFileTree);

                    const form = document.getElementById('dynamic-form');
                    const placeholders = (fileData.ChinesePromptTemplate || "").match(/{{\s*[^}]+\s*}}/g) || [];

                    placeholders.forEach((placeholder, index) => {
                        const inputDiv = document.createElement('div');
                        inputDiv.classList.add('input-group');

                        const label = document.createElement('label');
                        label.textContent = fileData.Inputs[index].InputLabel;
                        inputDiv.appendChild(label);

                        if (fileData.Inputs[index].InputList) {
                            const select = document.createElement('select');
                            select.classList.add('styled-select');
                            const customOption = document.createElement('option');
                            customOption.value = 'custom';
                            customOption.textContent = '自定义输入';
                            select.appendChild(customOption);

                            fileData.Inputs[index].InputList.forEach(optionValue => {
                                const option = document.createElement('option');
                                option.value = optionValue;
                                option.textContent = optionValue;
                                select.appendChild(option);
                            });
                            inputDiv.appendChild(select);

                            const inputContainer = document.createElement('div');
                            inputContainer.classList.add('input-group-sub', 'hidden');

                            const textarea = document.createElement('textarea');
                            textarea.placeholder = `请输入${fileData.Inputs[index].InputLabel}`;
                            textarea.classList.add('styled-textarea');
                            textarea.dataset.placeholder = placeholder.slice(2, -2).trim();
                            inputContainer.appendChild(textarea);
                            inputDiv.appendChild(inputContainer);

                            if (select.value === 'custom' || select.selectedIndex === 0) {
                                inputContainer.classList.remove('hidden');
                            }

                            select.addEventListener('change', () => {
                                if (select.value === 'custom') {
                                    inputContainer.classList.remove('hidden');
                                } else {
                                    inputContainer.classList.add('hidden');
                                }
                                updateOutput(fileData.ChinesePromptTemplate);
                            });

                            textarea.addEventListener('input', () => {
                                if (select.value === 'custom') {
                                    updateOutput(fileData.ChinesePromptTemplate);
                                }
                            });
                        } else {
                            const textarea = document.createElement('textarea');
                            textarea.placeholder = fileData.Inputs[index].InputPlaceholder;
                            textarea.classList.add('styled-textarea');
                            inputDiv.appendChild(textarea);
                        }

                        form.appendChild(inputDiv);
                    });

                    const languageSwitch = document.getElementById('language-switch');
                    const languageLabel = document.getElementById('language-label');

                    languageSwitch.addEventListener('change', () => {
                        if (languageSwitch.checked) {
                            languageLabel.textContent = '英文';
                            switchTemplate('EnglishPromptTemplate');
                        } else {
                            languageLabel.textContent = '中文';
                            switchTemplate('ChinesePromptTemplate');
                        }
                    });

                    function switchTemplate(templateKey) {
                        form.innerHTML = '';

                        const placeholders = (fileData[templateKey] || "").match(/{{\s*[^}]+\s*}}/g) || [];

                        placeholders.forEach((placeholder, index) => {
                            const inputDiv = document.createElement('div');
                            inputDiv.classList.add('input-group');

                            const label = document.createElement('label');
                            label.textContent = fileData.Inputs[index].InputLabel;
                            inputDiv.appendChild(label);

                            if (fileData.Inputs[index].InputList) {
                                const select = document.createElement('select');
                                select.classList.add('styled-select');
                                const customOption = document.createElement('option');
                                customOption.value = 'custom';
                                customOption.textContent = '自定义输入';
                                select.appendChild(customOption);

                                fileData.Inputs[index].InputList.forEach(optionValue => {
                                    const option = document.createElement('option');
                                    option.value = optionValue;
                                    option.textContent = optionValue;
                                    select.appendChild(option);
                                });
                                inputDiv.appendChild(select);

                                const inputContainer = document.createElement('div');
                                inputContainer.classList.add('input-group-sub', 'hidden');

                                const textarea = document.createElement('textarea');
                                textarea.placeholder = `请输入${fileData.Inputs[index].InputLabel}`;
                                textarea.classList.add('styled-textarea');
                                textarea.dataset.placeholder = placeholder.slice(2, -2).trim();
                                inputContainer.appendChild(textarea);
                                inputDiv.appendChild(inputContainer);

                                if (select.value === 'custom' || select.selectedIndex === 0) {
                                    inputContainer.classList.remove('hidden');
                                }

                                select.addEventListener('change', () => {
                                    if (select.value === 'custom') {
                                        inputContainer.classList.remove('hidden');
                                    } else {
                                        inputContainer.classList.add('hidden');
                                    }
                                    updateOutput(fileData[templateKey]);
                                });

                                textarea.addEventListener('input', () => {
                                    if (select.value === 'custom') {
                                        updateOutput(fileData[templateKey]);
                                    }
                                });
                            } else {
                                const textarea = document.createElement('textarea');
                                textarea.placeholder = fileData.Inputs[index].InputPlaceholder;
                                textarea.classList.add('styled-textarea');
                                inputDiv.appendChild(textarea);
                            }

                            form.appendChild(inputDiv);
                        });

                        updateOutput(fileData[templateKey]);
                    }

                    function updateOutput(template) {
                        const output = document.getElementById('output');
                        let result = template;

                        // 获取所有输入组
                        const inputs = form.querySelectorAll('.input-group');

                        // 按顺序替换占位符
                        inputs.forEach((inputGroup, index) => {
                            const placeholderPattern = /{{\s*[^}]+\s*}}/;
                            let value = '';

                            // 获取下拉菜单和自定义输入框的值
                            const select = inputGroup.querySelector('select');
                            if (select) {
                                if (select.value === 'custom') {
                                    const subTextarea = inputGroup.querySelector('.input-group-sub textarea');
                                    value = subTextarea ? subTextarea.value.trim() : '';
                                } else {
                                    value = select.value;
                                }
                            } else {
                                // 获取文本区域的值
                                const textarea = inputGroup.querySelector('textarea');
                                if (textarea) {
                                    value = textarea.value.trim();
                                }
                            }

                            // 替换当前索引对应的占位符，仅替换第一个匹配的占位符
                            result = result.replace(placeholderPattern, value || '');
                        });

                        output.value = result;
                    }

                    form.addEventListener('input', () => {
                        const templateKey = languageSwitch.checked ? 'EnglishPromptTemplate' : 'ChinesePromptTemplate';
                        updateOutput(fileData[templateKey]);
                    });

                    switchTemplate('ChinesePromptTemplate');

                    document.getElementById('copy-button').addEventListener('click', () => {
                        const output = document.getElementById('output');
                        navigator.clipboard.writeText(output.value).then(() => {
                            document.getElementById('copy-button').textContent = 'check';
                            setTimeout(() => {
                                document.getElementById('copy-button').textContent = 'content_copy';
                            }, 2000);
                        }).catch(err => {
                            console.error('Failed to copy text: ', err);
                        });
                    });
                }
            };

            showFileTree();
        });
});
