package net.happykoo.domain.todo.service;

import net.happykoo.domain.todo.vo.TodoItem;

import java.util.List;

public interface TodoService {
    List<TodoItem> findAll();
    void add(TodoItem todoItem);
    void update(TodoItem todoItem);
    void deleteById(int id);

    TodoItem findById(int id);
}
