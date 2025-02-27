import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsInt, IsOptional, IsString, IsUrl, Matches, MaxLength } from 'class-validator';
import { Recipe } from './recipe.entity';

@Entity('recipe_instructions')
export class RecipeInstruction {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Index()
  @Column({ select: false })
  recipeId: string;

  @ApiProperty()
  @IsInt()
  @Column({ type: 'smallint' })
  step: number;

  @ApiProperty()
  @IsString()
  @MaxLength(1000)
  @Column({ type: 'varchar', length: 1000 })
  text: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(/^[0-5][0-9]:[0-5][0-9]$/)
  @Column({ type: 'varchar', length: 5, nullable: true })
  videoStartTime?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(/^[0-5][0-9]:[0-5][0-9]$/)
  @Column({ type: 'varchar', length: 5, nullable: true })
  videoEndTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @Column({ type: 'varchar', length: 2000, nullable: true })
  imageUrl?: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', select: false })
  updatedAt: Date;
}
