import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TodosService {
    constructor (
        private readonly prismaService: PrismaService, 
        private readonly jwtService: JwtService
    ) {}

    async getTodos() {

    }

    async postTodos(id: string) {

    } 

    async updateTodos(id: string) {

    }

    async deleteTodos(id: string) {

    }
}