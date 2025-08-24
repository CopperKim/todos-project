import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TodosDto } from "./dto/todos.dto";

@Injectable()
export class TodosService {
    constructor (
        private readonly prismaService: PrismaService
    ) {}

    async getTodos(userid: string) {

        return await this.prismaService.todo.findMany( { where : { userId : userid } } )

    }

    async postTodos(userId: string, dto : TodosDto) {
        
        const user = await this.prismaService.user.findUnique( { where : { id : userId } } )
        
        if (!user) return new UnauthorizedException('Invalid credentials'); 

        // if (due <= Date.now()) return new UnauthorizedException('due date should be later')

        return await this.prismaService.todo.create({ 
            data: { 
                userId: userId, 
                title: dto.title, 
                content: dto.content,
                dueDate: dto.dueDate || Date.now() 
            } 
        }) 

    } 

    async updateTodos(todoId: string, userId: string, dto : TodosDto) {

        const uniqueTodo = await this.prismaService.todo.findUnique({where : { id : todoId }} )

        if ( !uniqueTodo ) throw new NotFoundException('invalid todo id')

        if ( uniqueTodo.userId !== userId ) throw new ForbiddenException('userId does not match!')

        return this.prismaService.todo.update( { where : { id : todoId }, data : {
            title: dto.title, 
            content: dto.content, 
            dueDate: dto.dueDate || Date.now() 
        } })

    }

    async deleteTodos(todoId: string, userId: string) {

        const uniqueTodo = await this.prismaService.todo.findUnique( {where : {id : todoId }})

        if (!uniqueTodo) throw new NotFoundException('invalid todo id')

        if (uniqueTodo.userId !== userId) throw new ForbiddenException('userId does not match')

        return this.prismaService.todo.delete( { where : { id : todoId }}); 
        
    }
}