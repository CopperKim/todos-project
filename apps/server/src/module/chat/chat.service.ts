import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from "@nestjs/common";

type ChatDto = {} 
type ChatListDto = {} 

@Injectable() 
export class ChatService {
    constructor(
        private readonly prismaService: PrismaService
    ) {} 

    async createChat(participantIdsInput: string[]) {
        const participantIds = [...new Set(participantIdsInput)].filter(Boolean);
        
        if (participantIds.length < 2) throw new Error("at least two members");

        const chat = await this.prismaService.$transaction(async (tx) => {
            const c = await tx.chat.create({ data: {} });

            await tx.chatParticipant.createMany({
            data: participantIds.map((userId) => ({ chatId: c.id, userId })),
            });

            return c;
        });

        return this.prismaService.chat.findUnique({
            where: { id: chat.id },
            include: { participants: { include: { user: true } } },
        });
    }

    async getChat(chatId: string, requesterId: string): Promise<ChatDto>

    async listMyChats(userId: string): Promise<ChatListDto>

    async leaveChat(chatId: string, userId: string): Promise<void>

}