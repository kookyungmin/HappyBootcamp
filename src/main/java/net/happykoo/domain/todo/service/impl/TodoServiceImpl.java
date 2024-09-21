package net.happykoo.domain.todo.service.impl;

import lombok.extern.slf4j.Slf4j;
import net.happykoo.domain.todo.dao.TodoDao;
import net.happykoo.domain.todo.service.TodoService;
import net.happykoo.domain.todo.vo.TodoItem;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("todoService")
@Slf4j
public class TodoServiceImpl implements TodoService {
    @Autowired
    private TodoDao todoDao;

    @Override
    public List<TodoItem> findAll() {
        return todoDao.findAll();
    }

    @Override
    public void add(TodoItem todoItem) {
        validCheck(todoItem);
        todoDao.add(todoItem);
    }

    @Override
    public void update(TodoItem todoItem) {
        todoDao.update(todoItem);
    }

    @Override
    public void deleteById(int id) {
        todoDao.deleteById(id);
    }

    @Override
    public TodoItem findById(int id) {
        return todoDao.findById(id);
    }

    private void validCheck(TodoItem todoItem) {
        if (StringUtils.isEmpty(todoItem.getContent())) {
            //TODO: 400 BAD REQUEST : HTTP Status code
            throw new IllegalArgumentException("Content cannot be empty");
        }
    }
}
