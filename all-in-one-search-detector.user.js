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
        console.log("尝试填充ChatGPT输入框");
        
        // 从URL中获取q参数
        const urlParams = new URLSearchParams(window.location.search);
        const searchText = urlParams.get('prompt');
        
        if (!searchText) {
            console.warn("URL中未找到搜索文本");
            return;
        }
        
        const decodedText = decodeURIComponent(searchText);
        console.log("从URL获取到文本:", decodedText);
        
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
                
                try {
                    // 设置内容 - 创建一个p标签并填入文本
                    const pElement = document.createElement('p');
                    pElement.textContent = decodedText;
                    
                    // 清空输入框并添加p元素
                    promptTextarea.innerHTML = '';
                    promptTextarea.appendChild(pElement);
                    
                    // 触发input事件，通知内容已更改
                    const inputEvent = new Event('input', { bubbles: true });
                    promptTextarea.dispatchEvent(inputEvent);
                    
                    // 等待内容确实更新后再按回车
                    setTimeout(() => {
                        // 验证内容是否已更新
                        if (promptTextarea.textContent.trim() === decodedText.trim()) {
                            console.log("确认内容已更新，准备按回车");
                            
                            // 模拟回车键
                            const eventProps = {
                                key: 'Enter',
                                code: 'Enter',
                                keyCode: 13,
                                which: 13,
                                bubbles: true,
                                cancelable: true
                            };
                            
                            promptTextarea.dispatchEvent(new KeyboardEvent('keydown', eventProps));
                            promptTextarea.dispatchEvent(new KeyboardEvent('keypress', eventProps));
                            promptTextarea.dispatchEvent(new KeyboardEvent('keyup', eventProps));
                            
                            console.log("已模拟按下回车键");
                        } else {
                            console.warn("内容未成功更新，不执行回车");
                        }
                    }, 100);
                    
                    console.log("已成功填充ChatGPT输入框");
                } catch (error) {
                    console.error("填充输入框失败:", error);
                }
            } else if (attempts >= maxAttempts) {
                console.warn("达到最大尝试次数，未找到ChatGPT输入框");
                clearInterval(checkInterval);
            }
        }, 100);
    }
    
    // 填充ChatGLM输入框
    function pasteTextToChatGLM() {
        console.log("尝试填充ChatGLM输入框");
        
        // 从URL中获取prompt参数
        const urlParams = new URLSearchParams(window.location.search);
        const promptText = urlParams.get('prompt');
        
        if (!promptText) {
            console.warn("URL中未找到prompt参数");
            return;
        }
        
        const decodedText = decodeURIComponent(promptText);
        console.log("从URL获取到文本:", decodedText);
        
        // 等待输入框加载完成
        let attempts = 0;
        const maxAttempts = 20; // 最多尝试20次
        
        const checkInterval = setInterval(() => {
            attempts++;
            console.log(`寻找ChatGLM输入框，尝试次数: ${attempts}`);
            
            const textarea = document.querySelector('textarea');
            
            if (textarea) {
                console.log("找到ChatGLM输入框");
                clearInterval(checkInterval);
                
                try {
                    // 设置文本内容
                    textarea.value = decodedText;
                    
                    // 触发input事件
                    const inputEvent = new Event('input', { bubbles: true });
                    textarea.dispatchEvent(inputEvent);
                    
                    // 等待内容确实更新后再按回车
                    setTimeout(() => {
                        if (textarea.value.trim() === decodedText.trim()) {
                            console.log("确认内容已更新，准备按回车");
                            
                            const eventProps = {
                                key: 'Enter',
                                code: 'Enter',
                                keyCode: 13,
                                which: 13,
                                bubbles: true,
                                cancelable: true
                            };
                            
                            textarea.dispatchEvent(new KeyboardEvent('keydown', eventProps));
                            textarea.dispatchEvent(new KeyboardEvent('keypress', eventProps));
                            textarea.dispatchEvent(new KeyboardEvent('keyup', eventProps));
                            
                            console.log("已模拟按下回车键");
                        } else {
                            console.warn("内容未成功更新，不执行回车");
                        }
                    }, 100);
                    
                    console.log("已成功填充ChatGLM输入框");
                } catch (error) {
                    console.error("填充输入框失败:", error);
                }
            } else if (attempts >= maxAttempts) {
                console.warn("达到最大尝试次数，未找到ChatGLM输入框");
                clearInterval(checkInterval);
            }
        }, 100);
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