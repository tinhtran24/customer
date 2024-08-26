import { TypeOrmModule } from "@nestjs/typeorm";
import { Note } from "./entities/note.entity";
import { NoteRepository } from "./note.reposity";
import { DatabaseModule } from "src/database/database.module";
import { Module } from "@nestjs/common";
import { NoteController } from "./note.controller";
import { NoteService } from "./note.service";

@Module({
    imports: [
      TypeOrmModule.forFeature([Note]),
      DatabaseModule.forRepository([NoteRepository]),
    ],
    controllers: [NoteController],
    providers: [NoteService],
  })
  export class NoteModule {}
  