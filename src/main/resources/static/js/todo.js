const createTodoCountElement = (todoList) => {
    const $todoCountEl = document.getElementById("todo-count")
    if (!$todoCountEl) return

    const completedCount = todoList.filter(item => item.completed).length

    $todoCountEl.innerText = `전체건수 :  ${todoList.length} 건 / 완료된 건수 :  ${completedCount} 건`
}

const createTodoListElement = (todoList) => {
    const $todoListUl = document.getElementById("todo-list")
    $todoListUl.innerHTML = ''
    for(let item of todoList) {
        $todoListUl.innerHTML +=
            `<li class="pt-3 pb-3">
                <div class="flex items-center space-x-4 rtl:space-x-reverse">
                    <div class="flex-shrink-0" onclick="updateItem(${item.id}, ${item.completed})">
                        <i class="fa-solid fa-check text-2xl cursor-pointer ${item.completed ? 'text-green-500' : 'text-zinc-300'}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-lg font-medium text-gray-900 truncate dark:text-white">
                            ${item.content}
                        </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-zinc-300">
                        <i class="fa-solid fa-trash cursor-pointer" onclick="deleteItem(${item.id})"></i>
                    </div>
                </div>
            </li>`
    }
}

const getTodoList = () => {
    sendGetAjax("/api/todo-items",  (res) => {
        const todoList = JSON.parse(res)
        createTodoCountElement(todoList)
        createTodoListElement(todoList)
    })
}

const addItem = (event) => {
    event.preventDefault()
    const $el = document.getElementById("todo-content")
    const content = $el.value
    sendPostAjax('/api/todo-items', { content }, () => {
        $el.value = ''
        getTodoList()
    });
}

const updateItem = (id, completed) => {
    sendPutAjax(`/api/todo-items/${id}`, { completed : !completed }, getTodoList)
}

const deleteItem = (id) => {
    sendDeleteAjax(`/api/todo-items/${id}`, getTodoList)
}

const sendGetAjax = (url, successCallback) => {
    sendAjax(url, 'GET', null, successCallback)
}

const sendPostAjax = (url, body, successCallback) => {
    sendAjax(url, 'POST', body, successCallback)
}

const sendPutAjax = (url, body, successCallback) => {
    sendAjax(url, 'PUT', body, successCallback)
}

const sendDeleteAjax = (url, successCallback) => {
    sendAjax(url, 'DELETE', null, successCallback)
}

const sendAjax = (url, method, body, successCallback) => {
    const xhr = new XMLHttpRequest()

    xhr.open(method, url)
    xhr.setRequestHeader("content-type", "application/json; charset=UTF-8");
    if (body) {
        xhr.send(JSON.stringify(body))
    } else {
        xhr.send()
    }
    xhr.onload = (res) => {
        if (res.target.status === 200) {
            successCallback(res.target.response)
        } else {
            console.error("ERROR !! ", res.target)
        }
    }
}

window.onload = getTodoList