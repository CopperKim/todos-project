import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TodosDto } from "../../common/dto/todos.dto";

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async getTodos(userId: string) {
    // userId 소유의 todo만
    return this.prisma.todo.findMany({ where: { userId } });
  }

  async postTodos(userId: string, dto: TodosDto) {
    // 유저 존재 확인
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    // if (due.getTime() <= Date.now()) throw new UnauthorizedException("due date should be later");

    return this.prisma.todo.create({
      data: {
        // 관계 연결은 connect 사용
        user: { connect: { id: userId } },
        // 스키마에 기본값 있으므로 undefined면 스킵됨
        title: dto.title ?? undefined,
        content: dto.content ?? undefined,
        dueDate: dto.dueDate,
      },
    });
  }

  async updateTodos(todoId: string, userId: string, dto: TodosDto) {
    const todo = await this.prisma.todo.findUnique({ where: { id: todoId } });
    if (!todo) throw new NotFoundException("invalid todo id");
    if (todo.userId !== userId)
      throw new ForbiddenException("userId does not match!");

    return this.prisma.todo.update({
      where: { id: todoId },
      data: {
        title: dto.title ?? undefined,
        content: dto.content ?? undefined,
        dueDate: dto.dueDate ?? undefined,
      },
    });
  }

  async deleteTodos(todoId: string, userId: string) {
    const todo = await this.prisma.todo.findUnique({ where: { id: todoId } });
    if (!todo) throw new NotFoundException("invalid todo id");
    if (todo.userId !== userId)
      throw new ForbiddenException("userId does not match");

    return this.prisma.todo.delete({ where: { id: todoId } });
  }
}
