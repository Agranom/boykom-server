import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;
}
