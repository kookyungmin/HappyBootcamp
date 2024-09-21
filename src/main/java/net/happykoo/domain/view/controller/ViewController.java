package net.happykoo.domain.view.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping({ "", "/" })
public class ViewController {
    @GetMapping("")
    public String index() {
        return "redirect:/todo";
    }

    @GetMapping("/todo")
    public String todo() {
        return "todo";
    }
}
