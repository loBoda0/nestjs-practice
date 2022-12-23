import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>
  ) {}
  /* getAllBoards(): Board[] {
    return this.boards;
  } */

  async getAllBoards(): Promise<Board[]> {
    /* const query = this.boardRepository.createQueryBuilder('board');

    const boards = await query.getMany();

    return boards; */
    return this.boardRepository.find({loadRelationIds: true})
  }

  async getBoardById(id: number, user: User): Promise<Board> {
    const found = await this.boardRepository.findOne({ where: {id}, loadRelationIds: true});
    console.log(user)
    if (!found) {
        throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    if (user.id !== Number(found.user)) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    return found;
  }

  async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {

    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user
    });
    await this.boardRepository.save(board);
    return board;
  }

  async deleteBoard(id: number, user: User): Promise<void> {
    console.log(user)
    const result = await this.boardRepository.delete({id});

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`)
    }
  }

  async updateBoardStatus(id: number, status: BoardStatus, user: User): Promise<Board> {
    const board = await this.getBoardById(id, user);
    board.status = status;

    await this.boardRepository.save(board)

    return board;
  }

  /* getBoardById(id: string): Board {
    const found = this.boards.find(board => board.id === id);

    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`)
    }

    return found;
  }

  createBoard(createBoardDto: CreateBoardDto) {
    const { title, description } = createBoardDto

    const board: Board = {
      id: randomUUID(),
      title,
      description,
      status: BoardStatus.PUBLIC
    };

    this.boards.push(board);
    return board;
  }

  updateBoardStatus(id: string, status: BoardStatus): Board {
    const board = this.getBoardById(id);
    board.status = status;
    return board;
  }

  deleteBoard(id: string): void {
    const found = this.getBoardById(id);
    this.boards = this.boards.filter(board => board.id !== id)
  } */
}
