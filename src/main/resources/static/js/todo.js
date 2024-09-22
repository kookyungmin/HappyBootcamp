const sendDeleteAjax = (url) => {
    return sendAjax(url, 'DELETE')
}

const sendPutAjax = (url, body) => {
    return sendAjax(url, 'PUT', body)
}

const sendPostAjax = (url, body) => {
    return sendAjax(url, 'POST', body)
}

const sendGetAjax = (url) => {
    return sendAjax(url, 'GET')
}

const sendAjax = (url, method, body) => {
    return axios({
        url: url,
        method: method,
        data: body,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

const CommonModal = ({ content, submitBtnText, cancelBtnText, onConfirm }) => {
    const [ isOpen, setIsOpen ] = React.useState(true)

    const clickModal = (confirm) => {
        onConfirm(confirm)
        setIsOpen(false)
    }

    const clickModalBtn = (event, confirm) => {
        event.stopPropagation()
        clickModal(confirm)
    }

    return (
        <React.Fragment>
            {isOpen &&
                <div tabIndex="-1"
                     style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                     onClick={() => clickModal(false)}
                     className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-md max-h-full"
                         onClick={(event) => event.stopPropagation()}>
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button type="button"
                                    className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={(event) => clickModalBtn(event, false)}>
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5 text-center">
                                <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                </svg>
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{content}</h3>
                                <button id="delete-btn" type="button"
                                        onClick={(event) => clickModalBtn(event, true)}
                                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                    {submitBtnText}
                                </button>
                                <button type="button"
                                        onClick={(event) => clickModalBtn(event, false)}
                                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                    {cancelBtnText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}

const TodoListCount = ({ items }) => {
    const completedCount = items.filter(item => item.completed).length
    return (
        <h3 id="todo-count" className="text-sm text-center pt-3 pb-5">
            전체건수 :  {items.length} 건 / 완료된 건수 :  {completedCount} 건
        </h3>
    )
}

const TodoItem = ({ item, onUpdate }) => {
    const [ isOpenModal, setIsOpenModal ] = React.useState(false)
    const deleteItem = (confirm) => {
        if (!confirm) return
        sendDeleteAjax(`/api/todo-items/${item.id}`)
            .then(() => {
                onUpdate()
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {
                setIsOpenModal(false)
            })
    }

    const updateItem = () => {
        sendPutAjax(`/api/todo-items/${item.id}`, { completed : !item.completed })
            .then(() => {
                onUpdate()
            })
            .catch(err => {
                console.error(err)
            })
    }

    return (
        <React.Fragment>
            <li className="pt-3 pb-3">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="flex-shrink-0" onClick={updateItem}>
                        <i className={`fa-solid fa-check text-2xl cursor-pointer ${item.completed ? 'text-green-500' : 'text-zinc-300'}`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-gray-900 truncate dark:text-white">
                            {item.content}
                        </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-zinc-300">
                        <i className="fa-solid fa-trash cursor-pointer"
                           onClick={() => setIsOpenModal(true)}></i>
                    </div>
                </div>
            </li>
            {isOpenModal &&
                <CommonModal content={'정말로 삭제하시겠어요?'}
                             submitBtnText={'삭제'}
                             cancelBtnText={'취소'}
                             onConfirm={deleteItem}/>
            }
        </React.Fragment>
    )
}

const TodoInput = ({ onAdd }) => {
    const [ content, setContent ] = React.useState('')
    const inputRef = React.useRef()
    const addItem = () => {
        if (!content) {
            inputRef.current.focus()
            return alert('할 일을 입력해주세요.')
        }
        sendPostAjax('/api/todo-items', { content })
            .then(() => {
                setContent('')
                onAdd()
            })
            .catch(err => {
                console.error(err)
            })
    }

    const keyUpInput = (event) => {
        if (event.key !== 'Enter') return
        addItem()
    }

    return (
        <div className="max-w-md mx-auto">
            <label htmlFor="todo-content" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Todo
                Content</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input ref={inputRef} value={content} onChange={(event) => {setContent(event.target.value)}} onKeyUp={keyUpInput}
                       className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="오늘의 할 일은?" required/>
                <button onClick={addItem} className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">ADD
                </button>
            </div>
        </div>
    )
}

const TodoList = () => {
    const [ items, setItems ] = React.useState([])
    const [ loading, setLoading ] = React.useState(false)
    const getTodoList = () => {
        setLoading(true)
        sendGetAjax("/api/todo-items")
            .then(res => {
                setItems(res.data)
            })
           .catch(err => {
                console.error(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    React.useEffect(() => {
        getTodoList()
    }, [])

    return (
        <React.Fragment>
            <TodoListCount items={items} />
            <TodoInput onAdd={getTodoList}/>
            {loading ? <Spinner /> :
                <ul id="todo-list" className="max-w-md divide-y divide-gray-200 dark:divide-gray-700 mx-auto mt-4">
                    {items.map((item, idx) => {
                        return (
                            <TodoItem item={item} key={idx} onUpdate={getTodoList}/>
                        )
                    })}
                </ul>
            }
        </React.Fragment>
    )
}

const Ad = () => {
   return (
       <div
           className="fixed top-0 left-0 w-56 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
           <a href="#">
               <img className="rounded-t-lg" src="https://flowbite.com/docs/images/blog/image-4.jpg" alt=""/>
           </a>
           <div className="p-5">
               <a href="#">
                   <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy
                       technology acquisitions 2021</h5>
               </a>
               <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise
                   technology acquisitions of 2021 so far, in reverse chronological order.</p>
               <a href="#"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                   Read more
                   <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                             d="M1 5h12m0 0L9 1m4 4L9 9"/>
                   </svg>
               </a>
           </div>
       </div>
   )
}

const Spinner = () => {
    return (
        <div className="text-center">
            <div role="status">
                <svg aria-hidden="true"
                     className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                     viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"/>
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

const App = () => {
    return (
        <React.Fragment>
            <h1 className="text-3xl text-center pt-5 font-bold">TODO List</h1>
            <TodoList />
            <Ad />
        </React.Fragment>
    )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)