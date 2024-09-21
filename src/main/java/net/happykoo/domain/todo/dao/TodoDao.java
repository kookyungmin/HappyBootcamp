package net.happykoo.domain.todo.dao;

import net.happykoo.domain.todo.vo.TodoItem;

import java.util.List;

public interface TodoDao {
    List<TodoItem> findAll();
    void add(TodoItem todoItem);
    void update(TodoItem todoItem);
    void deleteById(int id);
}
