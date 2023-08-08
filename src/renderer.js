// 运行在 Electron 渲染进程 下的页面脚本

const editIconLight = `
<i class="q-icon" data-v-717ec976="" style="--b4589f60: inherit; --6ef2e80d: 16px;">
    <svg t="1691424497881" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4753" width="16" height="16">
        <path d="M686.4 224c-6.4-6.4-6.4-16 0-22.4l68-68c6.4-6.4 16-6.4 22.4 0l112.8 112.8c6.4 6.4 6.4 16 0 22.4l-68 68c-6.4 6.4-16 6.4-22.4 0L686.4 224zM384 776l372-372c5.6-5.6 4.8-15.2-1.6-20.8L641.6 269.6c-6.4-6.4-16-7.2-20.8-1.6L248 640l-56 192 192-56zM64 896v64h896v-64H64z" p-id="4754"></path>
    </svg>
</i>
`;

const editIconDark = `
<i class="q-icon" data-v-717ec976="" style="--b4589f60: inherit; --6ef2e80d: 16px;">
    <svg t="1691424497881" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4753" width="16" height="16">
        <path d="M686.4 224c-6.4-6.4-6.4-16 0-22.4l68-68c6.4-6.4 16-6.4 22.4 0l112.8 112.8c6.4 6.4 6.4 16 0 22.4l-68 68c-6.4 6.4-16 6.4-22.4 0L686.4 224zM384 776l372-372c5.6-5.6 4.8-15.2-1.6-20.8L641.6 269.6c-6.4-6.4-16-7.2-20.8-1.6L248 640l-56 192 192-56zM64 896v64h896v-64H64z" p-id="4754" fill="#ffffff"></path>
    </svg>
</i>
`;

function MenuEven(event) {
    var url = window.location.href;
    if (url.indexOf("#/main/message") == -1 && url.indexOf("#/chat/") == -1) return;

    var clickedElement = event.target;
    console.log(clickedElement.tagName);
    if (clickedElement.tagName !== 'DIV' && clickedElement.tagName !== 'SPAN') return;
    if (clickedElement.id === "qContextMenu" || clickedElement.id === 'mimo_repeater_btn') return;

    var qThemeValue = document.body.getAttribute('q-theme');
    var qContextMenuElement = document.querySelector("#qContextMenu.q-context-menu.q-context-menu__mixed-type");

    if (qContextMenuElement) {

        if (qContextMenuElement.querySelector("#mimo_msg_btn")) return

        var separatorDiv = document.createElement("div");
        separatorDiv.id = "mimo_msg_btn"
        separatorDiv.className = "q-context-menu-separator";
        separatorDiv.setAttribute("role", "separator");
        qContextMenuElement.appendChild(separatorDiv);

        var deleteLink = document.createElement("a");
        deleteLink.className = "q-context-menu-item q-context-menu-item--normal";
        deleteLink.setAttribute("aria-disabled", "false");
        deleteLink.setAttribute("role", "menuitem");
        deleteLink.setAttribute("tabindex", "-1");

        var icons = document.createElement('div');
        icons.className = 'q-context-menu-item__icon q-context-menu-item__head';
        if (qThemeValue == "light") {
            icons.innerHTML = editIconLight;
        } else {
            icons.innerHTML = editIconDark;
        }
        
        var deleteLinkText = document.createElement("span");
        deleteLinkText.className = "q-context-menu-item__text";
        deleteLinkText.textContent = "编辑消息内容";

        deleteLink.appendChild(icons);
        deleteLink.appendChild(deleteLinkText);
        qContextMenuElement.appendChild(deleteLink);

        deleteLink.addEventListener("click", function() {
            var qContextMenu = document.querySelector("#qContextMenu");
            qContextMenu.remove();

            Swal.fire({
                title: '编辑消息内容',
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                inputValue: clickedElement.textContent,
                showCancelButton: true,
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                showLoaderOnConfirm: true,
                preConfirm: (input) => {
                    if (input.trim() === '') {
                        Swal.showValidationMessage('请输入内容');
                    }
                    return input;
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    clickedElement.textContent = result.value;
                }
            });
        });

        var menubottom = qContextMenuElement.getBoundingClientRect().bottom;
        var menuright = qContextMenuElement.getBoundingClientRect().right;

        if (menubottom > window.innerHeight) {
            var currentTop = parseFloat(qContextMenuElement.style.top) || 0;
            qContextMenuElement.style.top = (currentTop - (menubottom - window.innerHeight) - 5) + 'px';
        }

        if (menuright > window.innerWidth) {
            var currentLeft = parseFloat(qContextMenuElement.style.left) || 0;
            qContextMenuElement.style.left = (currentLeft - (menuright - window.innerWidth) - 5) + 'px';
        }
    }
}

// 页面加载完成时触发
function onLoad() {

    const before_js = document.querySelector("#mimo_msg_js");
    if (before_js) {
        before_js.remove();
    }

    const before_css = document.querySelector("#mimo_msg_css");
    if (before_css) {
        before_css.remove();
    }

    const link = document.createElement("link");
    link.id = "mimo_msg_css"
    link.rel = "stylesheet"
    link.type = "text/css"
    link.href = `https://cdn.jsdelivr.net/npm/sweetalert2@11.0.20/dist/sweetalert2.min.css`
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.id = "mimo_msg_js"
    script.defer = "defer";
    script.src = `https://cdn.jsdelivr.net/npm/sweetalert2@11.0.20/dist/sweetalert2.min.js`;
    document.head.appendChild(script);

    window.addEventListener("contextmenu", MenuEven);
}


// 打开设置界面时触发
function onConfigView(view) {

}


// 这两个函数都是可选的
export {
    onLoad
}
