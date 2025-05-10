// ==UserScript==
// @name         All-in-One Search Detector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  检测URL中是否包含from_all_in_one_search=true参数，并自动粘贴剪贴板内容
// @author       You
// @match        https://chatgpt.com/*
// @match        https://chatglm.cn/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log("All-in-One Search Detector 已加载");

    // 检查URL中是否包含from_all_in_one_search=true参数
    function checkUrl() {
        try {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);

            console.log("检查URL参数: " + url.search);

            if (params.get('from_all_in_one_search') === 'true') {
                console.log("检测到All-in-One Search参数");

                // 根据不同网站执行不同的粘贴操作
                if (url.hostname === 'chatgpt.com') {
                    console.log("当前网站: ChatGPT");
                    pasteTextToChatGPT();
                } else if (url.hostname === 'chatglm.cn') {
                    console.log("当前网站: ChatGLM");
                    pasteTextToChatGLM();
                }
            } else {
                console.log("未检测到All-in-One Search参数");
            }
        } catch (error) {
            console.error("检查URL时发生错误:", error);
        }
    }

    // 粘贴文字到ChatGPT输入框
    function pasteTextToChatGPT() {
        console.log("尝试粘贴文字到ChatGPT输入框");

        // 等待输入框加载完成
        let attempts = 0;
        const maxAttempts = 20; // 最多尝试20次

        const checkInterval = setInterval(() => {
            attempts++;
            console.log(`寻找ChatGPT输入框，尝试次数: ${attempts}`);

            // 直接查找ChatGPT的输入框元素
            const promptTextarea = document.getElementById('prompt-textarea');

            if (promptTextarea) {
                console.log("找到ChatGPT输入框元素");
                clearInterval(checkInterval);

                // 模拟点击激活输入框
                try {
                    promptTextarea.click();
                    promptTextarea.focus();
                    console.log("已点击并聚焦输入框");

                    // 从剪贴板获取文本并粘贴
                    setTimeout(() => {
                        try {
                            navigator.clipboard.readText().then(text => {
                                if (text) {
                                    console.log("读取到剪贴板文本:", text);

                                    // 设置内容 - 创建一个p标签并填入文本
                                    const pElement = document.createElement('p');
                                    pElement.textContent = text;

                                    // 清空输入框并添加p元素
                                    promptTextarea.innerHTML = '';
                                    promptTextarea.appendChild(pElement);

                                    console.log("已成功粘贴到ChatGPT输入框");

                                    // 触发input事件，通知内容已更改
                                    const inputEvent = new Event('input', { bubbles: true });
                                    promptTextarea.dispatchEvent(inputEvent);

                                    // 延迟一下再模拟回车键
                                    setTimeout(() => {
                                        try {
                                            // 模拟完整的键盘事件序列
                                            const eventProps = {
                                                key: 'Enter',
                                                code: 'Enter',
                                                keyCode: 13,
                                                which: 13,
                                                bubbles: true,
                                                cancelable: true
                                            };

                                            // 按顺序发送keydown、keypress和keyup事件
                                            promptTextarea.dispatchEvent(new KeyboardEvent('keydown', eventProps));
                                            promptTextarea.dispatchEvent(new KeyboardEvent('keypress', eventProps));
                                            promptTextarea.dispatchEvent(new KeyboardEvent('keyup', eventProps));

                                            console.log("已模拟按下回车键");

                                        } catch (error) {
                                            console.error("模拟回车键失败:", error);
                                        }
                                    }, 1000);
                                } else {
                                    console.warn("剪贴板为空");
                                }
                            }).catch(err => {
                                console.error("读取剪贴板失败:", err);
                            });
                        } catch (error) {
                            console.error("粘贴操作失败:", error);
                        }
                    }, 500);
                } catch (error) {
                    console.error("点击输入框失败:", error);
                }
            } else if (attempts >= maxAttempts) {
                console.warn("达到最大尝试次数，未找到ChatGPT输入框");
                clearInterval(checkInterval);
            }
        }, 500);
    }

    // 粘贴文字到ChatGLM输入框
    function pasteTextToChatGLM() {
        console.log("尝试粘贴文字到ChatGLM输入框");

        // 等待输入框加载完成
        let attempts = 0;
        const maxAttempts = 20; // 最多尝试20次

        const checkInterval = setInterval(() => {
            attempts++;
            console.log(`寻找ChatGLM输入框，尝试次数: ${attempts}`);

            const textarea = document.querySelector('textarea');

            if (textarea) {
                console.log("找到ChatGLM输入框:", textarea);
                clearInterval(checkInterval);

                // 模拟点击激活输入框
                try {
                    textarea.click();
                    textarea.focus();
                    console.log("已点击并聚焦输入框");

                    // 从剪贴板获取文本并粘贴
                    setTimeout(() => {
                        try {
                            navigator.clipboard.readText().then(text => {
                                if (text) {
                                    console.log("读取到剪贴板文本:", text);

                                    // 设置文本内容
                                    textarea.value = text;

                                    // 触发input事件，通知textarea值已更改
                                    const inputEvent = new Event('input', { bubbles: true });
                                    textarea.dispatchEvent(inputEvent);

                                    console.log("已成功粘贴到ChatGLM输入框");

                                    // 延迟一下再模拟回车键
                                    setTimeout(() => {
                                        try {
                                            // 模拟完整的键盘事件序列
                                            const eventProps = {
                                                key: 'Enter',
                                                code: 'Enter',
                                                keyCode: 13,
                                                which: 13,
                                                bubbles: true,
                                                cancelable: true
                                            };

                                            // 按顺序发送keydown、keypress和keyup事件
                                            textarea.dispatchEvent(new KeyboardEvent('keydown', eventProps));
                                            textarea.dispatchEvent(new KeyboardEvent('keypress', eventProps));
                                            textarea.dispatchEvent(new KeyboardEvent('keyup', eventProps));

                                            console.log("已模拟按下回车键");

                                        } catch (error) {
                                            console.error("模拟回车键失败:", error);
                                        }
                                    }, 1000);
                                } else {
                                    console.warn("剪贴板为空");
                                }
                            }).catch(err => {
                                console.error("读取剪贴板失败:", err);
                            });
                        } catch (error) {
                            console.error("粘贴操作失败:", error);
                        }
                    }, 500);
                } catch (error) {
                    console.error("点击输入框失败:", error);
                }
            } else if (attempts >= maxAttempts) {
                console.warn("达到最大尝试次数，未找到ChatGLM输入框");
                clearInterval(checkInterval);
            }
        }, 500);
    }

    // 页面加载完成后检查URL
    // 使用较长的延迟，确保页面完全加载
    setTimeout(checkUrl, 2000);

    // 监听URL变化（SPA应用可能会改变URL而不刷新页面）
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log("URL变化，重新检查...");
            setTimeout(checkUrl, 2000);
        }
    }).observe(document, {subtree: true, childList: true});
})();