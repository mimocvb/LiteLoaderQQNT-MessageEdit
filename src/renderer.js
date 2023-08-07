// 运行在 Electron 渲染进程 下的页面脚本


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

    window.addEventListener("contextmenu", function(event) {
        var qContextMenuElement = document.querySelector("#qContextMenu.q-context-menu.q-context-menu__mixed-type");

        if (qContextMenuElement) {

            var clickedElement = event.target;

            var separatorDiv = document.createElement("div");
            separatorDiv.className = "q-context-menu-separator";
            separatorDiv.setAttribute("role", "separator");
            qContextMenuElement.appendChild(separatorDiv);

            var deleteLink = document.createElement("a");
            deleteLink.className = "q-context-menu-item q-context-menu-item--normal";
            deleteLink.setAttribute("aria-disabled", "false");
            deleteLink.setAttribute("role", "menuitem");
            deleteLink.setAttribute("tabindex", "-1");
            
            var deleteLinkText = document.createElement("span");
            deleteLinkText.className = "q-context-menu-item__text";
            deleteLinkText.textContent = "修改消息内容";

            deleteLink.appendChild(deleteLinkText);
            qContextMenuElement.appendChild(deleteLink);

            deleteLink.addEventListener("click", function() {
                var qContextMenu = document.querySelector("#qContextMenu");
                qContextMenu.remove();

                Swal.fire({
                    title: '请输入修改的内容',
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
        }
    });
}


// 打开设置界面时触发
function onConfigView(view) {

}


// 这两个函数都是可选的
export {
    onLoad,
    onConfigView
}