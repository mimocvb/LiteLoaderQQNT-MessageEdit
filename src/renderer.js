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

const SEPARATOR_HTML = `
<div class="q-context-menu-separator" role="separator"></div>
`;

function generateEditHtml() {
  let editIcon = editIconLight;
  var qThemeValue = document.body.getAttribute("q-theme");
  if (qThemeValue) {
    if (qThemeValue == "light") {
      editIcon = editIconLight;
    } else {
      editIcon = editIconDark;
    }
  }
  return `
<a
  id="edit_message_lqk"
  class="q-context-menu-item q-context-menu-item--normal"
  aria-disabled="false"
  role="menuitem"
  tabindex="-1"
>
  <div class="q-context-menu-item__icon q-context-menu-item__head">
${editIcon}
  </div>
  <span class="q-context-menu-item__text">编辑消息</span>
</a>
`;
}

function menuEventListener(event) {
  const { target } = event;
  const { classList } = target;
  if (
    ["text-normal", "message-content", "msg-content-container"].includes(
      classList[0]
    )
  ) {
    // 获取右键菜单
    const qContextMenu = document.querySelector("#qContextMenu");
    // 插入分隔线
    qContextMenu.insertAdjacentHTML("beforeend", SEPARATOR_HTML);
    // 插入编辑消息
    qContextMenu.insertAdjacentHTML("beforeend", generateEditHtml());
    // 调整右键菜单位置
    const rect = qContextMenu.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      qContextMenu.style.top = `${window.innerHeight - rect.height - 8}px`;
    }
    // 按键监听
    const edit_message = qContextMenu.querySelector("#edit_message_lqk");
    edit_message.addEventListener("click", () => {
      // 获取最里层元素
      const textNormal = target.querySelector(".text-normal");
      const targetElement = textNormal ? textNormal : target;
      const { innerText: rawText } = targetElement;
      if (rawText) {
        Swal.fire({
          title: "编辑消息内容",
          input: "text",
          inputAttributes: {
            autocapitalize: "off",
          },
          inputValue: rawText,
          showCancelButton: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          showLoaderOnConfirm: true,
          preConfirm: (input) => {
            if (input.trim() === "") {
              Swal.showValidationMessage("请输入内容");
            }
            return input;
          },
          allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
          if (result.isConfirmed) {
            targetElement.innerText = `${result.value}`;
          }
        });
      }
      // 关闭右键菜单
      qContextMenu.remove();
    });
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
  link.id = "mimo_msg_css";
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = `https://cdn.jsdelivr.net/npm/sweetalert2@11.0.20/dist/sweetalert2.min.css`;
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.id = "mimo_msg_js";
  script.defer = "defer";
  script.src = `https://cdn.jsdelivr.net/npm/sweetalert2@11.0.20/dist/sweetalert2.min.js`;
  document.head.appendChild(script);

  document.addEventListener("contextmenu",menuEventListener);
}

onLoad();
