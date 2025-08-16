import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { GetCurrentUser } from "../../common/decorator/getcurrentuser.decorator";
import { TodosDto } from "./dto/todos.dto";
import { TodosService } from "./todos.service";

@Controller('api/todo')
export class TodosController {
    constructor(
        private readonly todosService: TodosService
    ) {}

    @Get() 
    async getTodos(
        @GetCurrentUser('sub') userId: string
    ) {
        return this.todosService.getTodos(userId)
    }

    @Post()
    async postTodos(
        @GetCurrentUser('sub') userId : string,
        @Body() dto : TodosDto
    ) {
        return this.todosService.postTodos(userId, dto)
    }

    @Patch(':id')
    async updateTodo(
        @Param('id') todoId: string,
        @GetCurrentUser('sub') userId: string,
        @Body() dto : TodosDto
    ) {

        return await this.todosService.updateTodos(todoId, userId, dto)

    }

    @Delete(':id')
    async deleteTodo(
        @Param('id') todoId: string,
        @GetCurrentUser('sub') userId: string, 
    ) {

        return await this.todosService.deleteTodos(todoId, userId)

    }
}