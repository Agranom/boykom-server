import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import {
  ArrayNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { Type } from 'class-transformer';
import { RecipeInstruction } from './recipe-instruction.entity';

@Entity('recipes')
export class Recipe extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Index()
  @Column({ select: false })
  authorId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  @Column({ type: 'varchar', length: 200 })
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @Column({ type: 'varchar', length: 2000, nullable: true })
  imageUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @Column({ type: 'varchar', length: 2000, nullable: true })
  videoUrl?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Column({ type: 'integer', nullable: true })
  portionsCount?: number;

  @ApiProperty({ isArray: true, type: RecipeIngredient })
  @ArrayNotEmpty()
  @Type(() => RecipeIngredient)
  @ValidateNested({ each: true })
  @OneToMany(() => RecipeIngredient, (ing) => ing.recipe)
  ingredients: RecipeIngredient[];

  @ApiProperty({ isArray: true, type: RecipeInstruction })
  @ArrayNotEmpty()
  @Type(() => RecipeInstruction)
  @ValidateNested({ each: true })
  @OneToMany(() => RecipeInstruction, (ing) => ing.recipe)
  instructions: RecipeInstruction[];
}
