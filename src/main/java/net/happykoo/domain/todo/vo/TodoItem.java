package net.happykoo.domain.todo.vo;

import lombok.*;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@Alias("todoItem")
public class TodoItem {
    private int id;
    private String content;
    private boolean completed;
    private int seq;
}
