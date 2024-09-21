package net.happykoo.domain.todo.controller;

import net.happykoo.domain.todo.service.TodoService;
import net.happykoo.domain.todo.vo.TodoItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/todo")
public class TodoController {
    @Autowired
    private TodoService todoService;

    @GetMapping("/list")
    public String getTodoList(Model model) {
        List<TodoItem> todoList = todoService.findAll();

        model.addAttribute("todoList", todoList);
        return "todo";
    }

    @PostMapping("/addItem")
    public String addTodoItem(@ModelAttribute TodoItem todoItem) {
        todoService.add(todoItem);
        return "redirect:/todo/list";
    }

    @PostMapping("/updateItem")
    public String updateTodoItem(@ModelAttribute TodoItem todoItem) {
        todoService.update(todoItem);
        return "redirect:/todo/list";
    }

    @PostMapping("/deleteItem")
    public String deleteTodoItem(@ModelAttribute TodoItem todoItem) {
        todoService.deleteById(todoItem.getId());
        return "redirect:/todo/list";
    }
}
